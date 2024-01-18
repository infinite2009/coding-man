import { makeAutoObservable } from 'mobx';
import { ComponentId } from '@/types';

export type ViewMode = 'design' | 'code';

export default class EditorStore {
  componentIdForCopy: ComponentId;
  private hiddenComponents: Record<ComponentId, boolean> = {};
  leftPanelVisible = true;
  rightPanelVisible = true;
  selectedPath: string;
  viewMode: ViewMode = 'design';
  framework: 'React' | 'Vue' = 'React';
  language: 'TypeScript' | 'JavaScript' = 'TypeScript';

  constructor() {
    makeAutoObservable(this);
  }

  get hasCopiedComponent() {
    return !!this.componentIdForCopy;
  }

  setFramework(framework: 'React' | 'Vue', language: 'TypeScript' | 'JavaScript') {
    this.framework = framework;
    this.language = language;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'design' ? 'code' : 'design';
  }

  toggleExpandingCanvas() {
    this.toggleLeftPanelVisible();
    this.toggleRightPanelVisible();
  }

  toggleLeftPanelVisible() {
    this.leftPanelVisible = !this.leftPanelVisible;
  }

  toggleRightPanelVisible() {
    this.rightPanelVisible = !this.rightPanelVisible;
  }

  /**
   * 判断指定组件是否可见
   *
   * @param componentId
   */
  isVisible(componentId: ComponentId) {
    // 如果从隐藏组件字典里查不到，就是可见的
    return !this.hiddenComponents[componentId];
  }

  setComponentIdForCopy(componentId: ComponentId) {
    this.componentIdForCopy = componentId;
  }

  setSelectedPath(path: string) {
    this.selectedPath = path;
  }
}
