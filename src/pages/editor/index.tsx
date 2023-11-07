import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  CollisionDescriptor,
  CollisionDetection,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  DroppableContainer,
  MeasuringStrategy,
  MouseSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { Dropdown, Form, Input, message, Modal } from 'antd';

import Toolbar, { PageActionEvent } from '@/pages/editor/toolbar';
import PagePanel from '@/pages/editor/page-panel';
import ComponentPanel from '@/pages/editor/component-panel';
import TemplatePanel from '@/pages/editor/template-panel';
import CustomComponentPanel from '@/pages/editor/custom-component-panel';
import FormPanel from '@/pages/editor/form-panel';
import PageRenderer from '@/pages/components/page-renderer';

import LayerComponentPanel from '@/pages/editor/layer-component-panel';
import styles from './index.module.less';
import { createPortal } from 'react-dom';
import DropAnchor from '@/pages/editor/drop-anchor';
import { DragCancelEvent, DragEndEvent } from '@dnd-kit/core/dist/types';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import PageAction from '@/types/page-action';
import { useForm } from 'antd/es/form/Form';
import IAnchorCoordinates from '@/types/anchor-coordinate';
import { save } from '@tauri-apps/api/dialog';
import { dirname, documentDir, join, sep } from '@tauri-apps/api/path';
import ComponentFeature from '@/types/component-feature';
import fileManager from '@/service/file';
import Empty from '@/pages/editor/empty';
import { debounce } from 'lodash';
import { DataNode } from 'antd/es/tree';
import PanelTab, { PanelType } from '@/pages/editor/panel-tab';
import { ComponentId } from '@/types';
import ComponentTree from '@/pages/editor/component-tree';
import { ProjectInfo } from '@/types/app-data';
import CompositionPanel from '@/pages/editor/composition-panel';
import { DSLStoreContext } from '@/hooks/context';
import { observer } from 'mobx-react';
import ComponentSchemaRef from '@/types/component-schema-ref';
import IComponentSchema from '@/types/component.schema';

const collisionOffset = 4;

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
};

const tabsItems = [
  {
    key: 'component',
    label: '组件',
    children: <ComponentPanel />
  },
  {
    key: 'layer',
    label: '图层组件',
    children: <LayerComponentPanel />
  },
  {
    key: 'template',
    label: '模板',
    children: <TemplatePanel />
  },
  {
    key: 'custom',
    label: '业务组件',
    children: <CustomComponentPanel />
  }
];

export interface IEditorProps {
  onPreview: (projectId: string) => void;
  onPreviewClose: (projectId: string) => void;
  style?: CSSProperties;
}

export default observer(({ onPreview, onPreviewClose, style }: IEditorProps) => {
  const searchParams = new URLSearchParams(window.location.search);

  const [, setActiveId] = useState<string>('');
  const [pageCreationVisible, setPageCreationVisible] = useState<boolean>(false);
  const [currentProject, setCurrentProject] = useState<ProjectInfo>();
  const [projectData, setProjectData] = useState<any[]>([]);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [leftPanelType, setLeftPanelType] = useState<PanelType>(PanelType.file);
  const [leftPanelVisible, setLeftPanelVisible] = useState<boolean>(true);
  const [rightPanelVisible, setRightPanelVisible] = useState<boolean>(true);
  const [showDesign, setShowDesign] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [anchorStyle, setAnchorStyle] = useState<CSSProperties>();
  const [selectedComponentForRenaming, setSelectedComponentForRenaming] = useState<ComponentId>('');

  const [form] = useForm();

  const dslStore = useContext(DSLStoreContext);

  const insertIndexRef = useRef<number>(-1);
  const anchorCoordinatesRef = useRef<IAnchorCoordinates>();
  // TODO: 文件路径数据需要重构为 indexedDB 存储
  const defaultPathRef = useRef<string>();
  const filePathRef = useRef<string>();
  const componentIdToCloneRef = useRef<ComponentId>();
  const newNameForComponentRef = useRef<string>('');

  const codeType = (searchParams.get('codetype') as string) || 'react';

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 4
    }
  });

  const sensors = useSensors(mouseSensor);

  useEffect(() => {
    documentDir().then(p => {
      defaultPathRef.current = p;
    });
    fetchProjectData().then();
    fetchCurrentProject();
  }, []);

  useEffect(() => {
    if (currentProject) {
      const currentFile = currentProject.openedFile;
      if (currentFile) {
        openFile(currentFile).then();
      }
      setCurrentFile(currentFile || '');
    }
  }, [currentProject]);

  function fetchCurrentProject() {
    const projectId = fileManager.fetchCurrentProjectId();
    const currentProject = fileManager.fetchProjectInfo(projectId);
    setCurrentProject(currentProject);
  }

  async function fetchProjectData() {
    setProjectData(await fileManager.fetchProjectData());
  }

  function hideAnchor() {
    if (!dslStore) {
      return;
    }
    anchorCoordinatesRef.current = {
      top: 0,
      left: 0,
      height: 0,
      width: 0
    };
    setAnchorStyle(anchorCoordinatesRef.current);
  }

  function resetInsertIndexRef() {
    insertIndexRef.current = 0;
  }

  function handleDraggingStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDraggingMove({ over }: DragOverEvent) {
    if (over) {
      if (anchorCoordinatesRef.current) {
        setAnchorStyle(anchorCoordinatesRef.current);
      }
    } else {
      hideAnchor();
    }
  }

  function handleDraggingEnd({ active, over }: DragEndEvent) {
    if (over && active.data.current) {
      const { dndType, name, dependency } = active.data.current;
      if (dndType === 'insert') {
        try {
          dslStore.insertComponent(over.id as string, name, dependency, insertIndexRef.current);
        } catch (e) {
          message.error((e as any).toString()).then();
        }
      } else {
        dslStore.moveComponent(over.id as string, active.id as string, insertIndexRef.current);
      }
    }
    resetInsertIndexRef();
    hideAnchor();
  }

  function handleDraggingCancel({ active, over }: DragCancelEvent) {
    // 重置插入索引
    resetInsertIndexRef();
    hideAnchor();
  }

  function isInRect(
    point: {
      top: any;
      left: any;
    },
    rect: {
      top: any;
      right: any;
      bottom: any;
      left: any;
    },
    offset = 0
  ) {
    const { top: pointerTop, left: pointerLeft } = point;
    const { top, right, bottom, left } = rect;
    const correctedTop = top + offset;
    const correctedLeft = left + offset;
    const correctedRight = right - offset;
    const correctedBottom = bottom - offset;
    return (
      pointerTop > correctedTop &&
      pointerTop < correctedBottom &&
      pointerLeft > correctedLeft &&
      pointerLeft < correctedRight
    );
  }

  /**
   * 计算重叠的类型：
   * return 0 | 1 | 2. 0 表示没有重叠，1 表示左上角落在另一个矩形的内部边缘，2 表示左上角落在另一个矩形的核心区域
   */
  function calcIntersectionType(
    rect: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    },
    collisionRect: {
      top: number;
      left: number;
    }
  ) {
    const pointer = {
      top: collisionRect.top,
      left: collisionRect.left
    };
    if (!isInRect(pointer, rect)) {
      return 0;
    }
    if (isInRect(pointer, rect, collisionOffset)) {
      return 2;
    }
    return 1;
  }

  function isDescendant(
    entry: string,
    target: string,
    parentDict: {
      [key: string]: string;
    }
  ) {
    let currentParent = parentDict[entry];
    while (currentParent) {
      if (target === currentParent) {
        return true;
      }
      currentParent = parentDict[currentParent];
    }
    return false;
  }

  // 计算当前节点的深度
  function calculateDepth(
    id: string,
    parentDict: {
      [key: string]: string;
    }
  ) {
    let depth = 0;
    let parentId = id;
    while (parentId) {
      if (parentDict[parentId]) {
        depth++;
        parentId = parentDict[parentId];
      } else {
        break;
      }
    }
    return depth;
  }

  function sortCollisionsDesc(
    { data: { value: a } }: CollisionDescriptor,
    { data: { value: b } }: CollisionDescriptor
  ) {
    return b - a;
  }

  function setAnchorCoordinates(anchor: IAnchorCoordinates) {
    anchorCoordinatesRef.current = anchor;
  }

  /**
   * collisionRect: 碰撞矩形的尺寸数据
   * droppableRects: 所有可以放入的矩形尺寸数据 map
   * droppableContainers: 所有可以放入的矩形的节点信息，包括 id，data 等
   */
  const customDetection: CollisionDetection = useCallback(
    ({ active, collisionRect, droppableRects, droppableContainers }) => {
      const collisions: CollisionDescriptor[] = [];

      const parentDict: {
        [key: string]: string;
      } = {};

      if (active.data?.current?.isLayer) {
        const root = droppableContainers.find(item => item.data?.current?.dndType === 'root');
        if (root) {
          const { id } = root;
          const rect = droppableRects.get(id);
          if (rect) {
            // 这里的 collisionRect 就是移动的矩形
            const intersectionType = calcIntersectionType(rect, collisionRect);
            if (intersectionType === 2) {
              collisions.push({
                id,
                data: {
                  droppableContainer: root,
                  value: calculateDepth(id as string, parentDict),
                  ...root.data.current
                }
              });
            }
            const style = {
              top: (rect.top + rect.bottom) / 2,
              left: rect.left,
              width: rect.width,
              height: 2
            };
            setAnchorCoordinates(style);
            return collisions;
          }
          return [];
        }
        return [];
      }

      droppableContainers.forEach((item: DroppableContainer) => {
        if (item.data.current?.parentId) {
          parentDict[item.id] = item.data.current.parentId;
        }
      });

      for (const droppableContainer of droppableContainers) {
        // 查出每一个容器的矩形尺寸
        const { id } = droppableContainer;
        const rect = droppableRects.get(id);

        // 既不是自身，也不是自己的后代节点
        if (
          rect &&
          active.id !== id &&
          droppableContainer.data.current?.feature !== ComponentFeature.solid &&
          !isDescendant(id as string, active.id as string, parentDict)
        ) {
          // 这里的 collisionRect 就是移动的矩形
          const intersectionType = calcIntersectionType(rect, collisionRect);
          if (intersectionType === 2) {
            collisions.push({
              id,
              data: {
                droppableContainer,
                value: calculateDepth(id as string, parentDict),
                ...droppableContainer.data.current
              }
            });
          }
        }
      }

      const result = collisions.sort(sortCollisionsDesc);

      if (result.length) {
        const { vertical, childrenId = [] } = result[0].data;

        // 从结果中过滤出子节点
        const childrenRects = childrenId
          ?.map((item: string) => {
            return droppableRects.get(item);
          })
          .filter((item: never) => !!item);

        // 默认插入尾部
        insertIndexRef.current = childrenRects.length;
        if (childrenRects?.length) {
          const style = {
            top: 0,
            left: 0,
            width: 0,
            height: 0
          };

          for (let i = 0, l = childrenRects.length; i < l; i++) {
            const { top, right, bottom, left, height, width } = childrenRects[i];
            const { top: collisionTop, left: collisionLeft } = collisionRect;
            // 判断碰撞左上角和这些矩形的位置关系，落在两者之间的，设下一个 index 为插入位置
            if (!vertical) {
              // 如果在当前矩形同行
              if (collisionTop >= top && collisionTop <= bottom) {
                style.top = top;
                style.height = height;
                style.width = 2;

                if (collisionLeft <= left + collisionOffset) {
                  insertIndexRef.current = i;
                  style.left = left;
                  if (i > 0) {
                    const { bottom: preBottom, right: preRight } = childrenRects[i - 1];
                    // 如果和前一个没有换行
                    if (!(top > preBottom && left < preRight)) {
                      style.left = Math.round((preRight + left) / 2);
                    }
                  }
                  break;
                }

                if (i < l - 1) {
                  const { top: nextTop, left: nextLeft } = childrenRects[i + 1];
                  // 如果下一个矩形发生了换行
                  if (bottom < nextTop && nextLeft < right) {
                    if (collisionLeft > right - collisionOffset) {
                      style.left = right;
                      insertIndexRef.current = i + 1;
                      break;
                    }
                  }
                } else {
                  if (collisionLeft > right - collisionOffset) {
                    style.left = right;
                    insertIndexRef.current = i + 1;
                    break;
                  }
                }
              }
            } else {
              if (collisionTop < top + collisionOffset) {
                style.height = 2;
                style.width = width;
                style.left = left;
                if (i === 0) {
                  style.top = top;
                } else {
                  const { bottom: preBottom } = childrenRects[i - 1];
                  style.top = Math.round((top + preBottom) / 2);
                }
                insertIndexRef.current = i;
                break;
              }

              if (i === l - 1 && collisionTop > bottom - collisionOffset) {
                style.height = 2;
                style.width = width;
                style.left = left;
                insertIndexRef.current = i + 1;
                style.top = bottom;
              }
            }
          }
          setAnchorCoordinates(style);
        } else {
          const rect = droppableRects.get(result[0].id);
          if (rect) {
            let style;
            if (!vertical) {
              style = {
                top: rect.top,
                width: 2,
                height: rect.height,
                left: rect.left + Math.round(rect.width / 2)
              };
            } else {
              style = {
                top: rect.top + Math.round(rect.height / 2),
                width: rect.width,
                height: 2,
                left: rect.left
              };
            }
            setAnchorCoordinates(style);
            insertIndexRef.current = 0;
          }
        }
        return result;
      }
      return [];
    },
    []
  );

  function openPageCreationModal() {
    setPageCreationVisible(true);
  }

  function closePageCreationModal() {
    setPageCreationVisible(false);
  }

  async function createFile() {
    const { name = '新建页面', desc } = form.getFieldsValue();
    dslStore.createEmptyPage(name, desc);
    let selectedFile;
    if (selectedFolder) {
      selectedFile = [selectedFolder, sep, name, '.ditto'].join('');
    } else if (currentFile) {
      const dirName = await dirname(currentFile);
      selectedFile = [dirName, sep, name, '.ditto'].join('');
    } else if (projectData?.length) {
      selectedFile = [projectData[0].key, sep, name, '.ditto'].join('');
    } else {
      const defaultPath = await join((filePathRef.current || defaultPathRef.current) as string, `${name}.ditto`);
      selectedFile = await save({
        title: '新建页面',
        defaultPath,
        filters: [
          {
            name: 'Ditto文件',
            extensions: ['ditto']
          }
        ]
      });
    }
    if (selectedFile) {
      await fileManager.savePageDSLFile(selectedFile, dslStore.dsl);
      setCurrentFile(selectedFile);
      fetchProjectData();
    }
  }

  const saveFile = debounce(async () => {
    if (currentFile) {
      filePathRef.current = await dirname(currentFile);
      await fileManager.savePageDSLFile(currentFile, dslStore.dsl);
    }
  }, 1000);

  async function handleExportingPageCodeFile() {
    const extension = codeType === 'react' ? 'tsx' : 'vue';
    const exportPageCodeFile =
      codeType === 'react' ? fileManager.exportReactPageCodeFile : fileManager.exportVuePageCodeFile;
    const defaultPath = await join((filePathRef.current || defaultPathRef.current) as string, `index.${extension}`);
    const selectedFile = await save({
      title: '导出代码',
      defaultPath,
      filters: [
        {
          name: `${extension}文件`,
          extensions: [extension]
        }
      ]
    });
    if (selectedFile) {
      filePathRef.current = await dirname(selectedFile);
      await exportPageCodeFile.apply(fileManager, [selectedFile, dslStore.dsl]);
    }
  }

  function redirectToPreview() {
    if (!currentProject) {
      return;
    }
  }

  function toggleExpandingCanvas() {
    setLeftPanelVisible(!leftPanelVisible);
    setRightPanelVisible(!rightPanelVisible);
  }

  function toggleDesignAndCode(showDesign: boolean) {
    setShowDesign(showDesign);
  }

  function togglePageScale(scale: number) {
    setScale(scale || 1);
  }

  async function handleOnDo(e: PageActionEvent) {
    switch (e.type) {
      case PageAction.createPage:
        openPageCreationModal();
        break;
      case PageAction.redo:
        dslStore.redo();
        break;
      case PageAction.undo:
        dslStore.undo();
        break;
      case PageAction.clear:
        dslStore.clearPage();
        break;
      case PageAction.exportCode:
        handleExportingPageCodeFile().then();
        break;
      case PageAction.preview:
        redirectToPreview();
        break;
      case PageAction.saveFile:
        saveFile();
        break;
      case PageAction.openProject:
        await fileManager.openLocalProject();
        await fetchProjectData();
        break;
      case PageAction.expandCanvas:
        toggleExpandingCanvas();
        break;
      case PageAction.changeView:
        toggleDesignAndCode(e?.payload?.showDesign);
        break;
      case PageAction.changeScale:
        togglePageScale(e?.payload?.scale);
        break;
    }
  }

  function createBlankPage() {
    closePageCreationModal();
    createFile().then();
  }

  async function openFile(page: string) {
    if (!currentProject) {
      return;
    }
    const content = await fileManager.openFile(page, currentProject.id);
    if (content) {
      dslStore.initDSL(JSON.parse(content));
    } else {
      message.error('文件已损坏!');
    }
  }

  function handleSelectingPageOrFolder(page: DataNode) {
    if (page.isLeaf) {
      openFile(page.key as string).then();
      setCurrentFile(page.key as string);
    } else {
      setSelectedFolder(page.key as string);
    }
  }

  function handleTogglePanel(type: PanelType) {
    // TODO:
    setLeftPanelType(type);
  }

  function handleCancelSelectingComponent() {
    dslStore.unselectComponent();
  }

  function handleSelectingComponent(componentId: ComponentId) {
    dslStore.selectComponent(componentId);
  }

  function handleClickDropDownMenu(key: string, componentSchema: IComponentSchema) {
    // TODO
    switch (key) {
      case 'copy':
        componentIdToCloneRef.current = componentSchema.id;
        message.success('已复制').then();
        break;
      case 'paste':
        if (componentIdToCloneRef.current) {
          dslStore.cloneComponent(componentIdToCloneRef.current, componentSchema.id, 0);
        }
        break;
      case 'rename':
        // dslStore.renameComponent(componentSchema.id, );
        message.warning('重命名待实现');
        break;
      case 'delete':
        message.warning('删除待实现');
        break;
      default:
        break;
    }
  }

  function handleSelectingComponentForRenaming(componentId: ComponentId) {
    setSelectedComponentForRenaming(componentId);
  }

  function handleRenamingComponent(componentId: ComponentId, newName: string) {
    dslStore.renameComponent(componentId, newName);
    setSelectedComponentForRenaming('');
  }

  /**
   * 由于技术上文字节点具有特殊性（会被当作文字组件的 children props 处理），故不会在组件树里出现
   */
  function generateComponentTreeData(): any[] {
    if (!dslStore.dsl) {
      return [];
    }

    const hasNonTextChild = (node: IComponentSchema) => {
      return node.children?.some(item => !item.isText);
    };

    const generateDropDownMenu = (componentSchema: IComponentSchema) => {
      return {
        items: [
          {
            key: 'copy',
            label: (
              <div className={styles.dropDownItem}>
                <span>复制</span>
                <span className={styles.shortKey}>⌘ C</span>
              </div>
            )
          },
          {
            key: 'paste',
            label: (
              <div className={styles.dropDownItem}>
                <span>粘贴</span>
                <span className={styles.shortKey}>⌘ V</span>
              </div>
            )
          },
          {
            key: 'rename',
            label: (
              <div className={styles.dropDownItem}>
                <span>重命名</span>
                <span className={styles.shortKey}>⌘ R</span>
              </div>
            )
          },
          {
            type: 'divider' as unknown as any
          },
          {
            key: 'delete',
            label: (
              <div className={styles.dropDownItem}>
                <span>删除</span>
                <span className={styles.shortKey}>Del</span>
              </div>
            )
          }
        ],
        onClick: ({ key }: { key: string }) => handleClickDropDownMenu(key, componentSchema)
      };
    };

    const renderTreeNodeTitle = (componentSchema: IComponentSchema) => {
      return (
        <Dropdown
          menu={generateDropDownMenu(componentSchema)}
          overlayClassName={styles.dropdownContainer}
          destroyPopupOnHide
          trigger={['contextMenu']}
        >
          <div onDoubleClick={() => handleSelectingComponentForRenaming(componentSchema.id)}>
            {componentSchema.id === selectedComponentForRenaming ? (
              <Input
                defaultValue={componentSchema.displayName}
                onBlur={e => handleRenamingComponent(componentSchema.id, (e.target.value as unknown as string).trim())}
                onPressEnter={e =>
                  // @ts-ignore
                  handleRenamingComponent(componentSchema.id, (e.target.value as unknown as string).trim())
                }
              />
            ) : (
              componentSchema.displayName || componentSchema.name
            )}
          </div>
        </Dropdown>
      );
    };

    const recursiveMap = (data: any[]) => {
      return data
        .filter((item: ComponentSchemaRef) => !item.isText)
        .map((item: ComponentSchemaRef) => {
          const componentSchema = dsl.componentIndexes[item.current];
          const node: Record<string, any> = {
            key: componentSchema.id,
            title: renderTreeNodeTitle(componentSchema)
          };
          if (hasNonTextChild(componentSchema)) {
            node.children = recursiveMap(componentSchema.children);
          } else {
            node.isLeaf = true;
          }
          return node;
        });
    };
    const { dsl } = dslStore;
    return recursiveMap([dsl.child]);
  }

  /**
   * 渲染项目的文件目录，当前文件的组件树
   */
  function renderProjectPanel() {
    return (
      <>
        <div className={styles.pagePanel}>
          <PagePanel data={projectData} onSelect={handleSelectingPageOrFolder} selected={currentFile} />
        </div>
        <div className={styles.componentTree}>
          <ComponentTree
            data={generateComponentTreeData()}
            onSelect={handleSelectingComponent}
            onCancelSelect={handleCancelSelectingComponent}
          />
        </div>
      </>
    );
  }

  /**
   * 渲染模板、组件托盘
   */
  function renderComponentPanel() {
    return <CompositionPanel />;
  }

  /**
   * 渲染左侧托盘
   */
  function renderLeftPanel() {
    switch (leftPanelType) {
      case PanelType.file:
        return renderProjectPanel();
      case PanelType.component:
        return renderComponentPanel();
      default:
        return null;
    }
  }

  function renderDesignSection() {
    return (
      <>
        <DndContext
          collisionDetection={customDetection}
          sensors={sensors}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always
            }
          }}
          modifiers={[snapCenterToCursor]}
          onDragStart={handleDraggingStart}
          onDragMove={handleDraggingMove}
          onDragEnd={handleDraggingEnd}
          onDragCancel={handleDraggingCancel}
        >
          <div className={styles.draggableArea}>
            <div className={styles.panel} style={leftPanelVisible ? undefined : { width: 0, overflow: 'hidden' }}>
              {renderLeftPanel()}
            </div>
            <div className={styles.canvas}>
              <div className={styles.canvasInner}>
                {currentFile ? <PageRenderer mode="edit" scale={scale} /> : <Empty />}
              </div>
            </div>
          </div>
          {createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
              <div style={{ height: 40, width: 40, backgroundColor: '#f00' }}></div>
            </DragOverlay>,
            document.body
          )}
        </DndContext>
        <div className={styles.formPanel} style={rightPanelVisible ? undefined : { width: 0, overflow: 'hidden' }}>
          <FormPanel />
        </div>
      </>
    );
  }

  function renderCodeSection() {
    return <div>code works!</div>;
  }

  console.log('editor rendered');

  return (
    <div className={styles.main} style={style}>
      <div className={styles.topBar}>
        {showDesign ? (
          <PanelTab
            onSelect={handleTogglePanel}
            style={leftPanelVisible ? undefined : { width: 0, overflow: 'hidden', margin: 0, padding: 0 }}
          />
        ) : null}
        <Toolbar onDo={handleOnDo} />
      </div>
      <div className={styles.editArea}>{showDesign ? renderDesignSection() : renderCodeSection()}</div>

      <Modal
        title="创建页面"
        open={pageCreationVisible}
        onOk={createBlankPage}
        onCancel={closePageCreationModal}
        okText="确定"
        cancelText="取消"
        maskClosable={false}
      >
        <Form form={form}>
          <Form.Item label="页面名称" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="desc">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <DropAnchor style={anchorStyle} />
    </div>
  );
});
