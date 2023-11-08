import { Input, message, Tree } from 'antd';
import { DataNode, EventDataNode } from 'antd/es/tree';
import React, { Key, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DownOutlined, FileOutlined, FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import ProjectToolBar from '@/pages/editor/project-tool-bar';

import styles from './index.module.less';
import { findNodePath } from '@/util';
import { ComponentId } from '@/types';
import fileManager from '@/service/file';

interface PageData {
  key: string;
  title: string | ReactNode | any;
  children?: PageData[];
  isLeaf?: boolean;
  icon?: any;
}

export interface IPagePanel {
  data: PageData[];
  selected: string;
  onSelect: (page: DataNode) => void;
}

export default function PagePanel({ data = [], selected, onSelect }: IPagePanel) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<ComponentId>('');

  const clickTimeoutIdRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (selected && data.length) {
      setExpandedKeys(findNodePath({ key: undefined, children: data }, selected));
    }
  }, [selected, data]);

  const handlingSelect = useCallback(
    (_: any, selected: any) => {
      // 如果已经有值，说明之前点击了一次
      if (clickTimeoutIdRef.current) {
        return;
      }
      clickTimeoutIdRef.current = setTimeout(() => {
        if (onSelect) {
          console.log('单击: ', selected.selectedNodes[0]);
          onSelect(selected.selectedNodes[0]);
        }
        clickTimeoutIdRef.current = undefined;
      }, 200);
    },
    [onSelect, data]
  );

  const dataWithIcon = useMemo(() => {
    if (data) {
      const recursiveMap = (data: PageData[]) => {
        return data.map(item => {
          const converted = {
            ...item
          };
          if (item.children) {
            converted.children = recursiveMap(item.children);
          }
          if (item.isLeaf) {
            converted.icon = <FileOutlined />;
          } else {
            converted.icon = (props: any) => (props.expanded ? <FolderOpenOutlined /> : <FolderOutlined />);
          }
          if (item.key === selectedPath) {
            converted.title = (
              <Input
                defaultValue={item.title as string}
                autoFocus
                onFocus={e => e.target.select()}
                onBlur={e => handleRenamingPage(item.key, (e.target.value as string).trim())}
                onPressEnter={e =>
                  // @ts-ignore
                  handleRenamingPage(item.key, (e.target.value as unknown as string).trim())
                }
              />
            );
          } else {
            converted.title = (
              <span
                onDoubleClick={e => {
                  e.stopPropagation();
                  if (clickTimeoutIdRef.current !== undefined) {
                    clearTimeout(clickTimeoutIdRef.current);
                    clickTimeoutIdRef.current = undefined;
                  }
                  setSelectedPath(converted.key);
                }}
              >
                {converted.title}
              </span>
            );
          }
          return converted;
        });
      };

      return recursiveMap(data);
    }
    return [];
  }, [data, selectedPath]);

  async function handleRenamingPage(path: string, newName: string) {
    try {
      await fileManager.renamePage(path, newName);
      setSelectedPath('');
    } catch (e) {
      message.error(e.toString());
    }
  }

  function handleExpand(
    expandedKeys: Key[],
    data: {
      node: EventDataNode<{
        key: string;
        title: string;
        children?: PageData[] | undefined;
        isLeaf?: boolean | undefined;
        icon?: any;
      }>;
      expanded: boolean;
      nativeEvent: MouseEvent;
    }
  ) {
    setExpandedKeys(expandedKeys as string[]);
  }

  function handleCreatingPage() {}

  function handleCreatingDirectory() {}

  function handleSearchingPage() {}

  return (
    <div>
      <ProjectToolBar
        onCreatingPage={handleCreatingPage}
        onCreatingDirectory={handleCreatingDirectory}
        onSearch={handleSearchingPage}
      />
      {dataWithIcon?.length > 0 ? (
        <div className={styles.projectTree}>
          <Tree
            switcherIcon={<DownOutlined />}
            showIcon
            selectedKeys={[selected]}
            onExpand={handleExpand}
            expandedKeys={expandedKeys}
            onSelect={handlingSelect}
            treeData={dataWithIcon}
          />
        </div>
      ) : null}
    </div>
  );
}
