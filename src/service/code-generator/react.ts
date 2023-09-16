import IPageSchema from '@/types/page.schema';
import { toUpperCase, typeOf } from '@/util';
import TypeScriptCodeGenerator, { IConstantOptions, IFunctionOptions } from '@/service/code-generator/typescript';
import IComponentSchema from '@/types/component.schema';
import { ImportType } from '@/types';
import IPropsSchema from '@/types/props.schema';
import { ComponentRef } from 'react';
import ComponentSchemaRef from '@/types/component-schema-ref';

export interface ITSXOptions {
  text?: string;
  componentName?: string;
  propsStrArr?: string[];
  children?: ITSXOptions[];
}

export interface IPropsOptions {
  name: string;
  variableName?: string;
  value?: string;
  variableType: string;
  variableValueSource?: 'editorInput' | 'httpRequest' | 'calculation';
}

export interface IUseEffectOptions {
  dependencies?: string[];
  handlerCallingSentence: string;
}

export interface IUseStateOptions {
  // 初始值的字符串
  initialValue: any;
  valueType: string;
  name: string;
}

export interface IUseMemoOptions {
  dependencies?: string[];
  handlerCallingSentence: string;
}

export interface IUseCallbackOptions {
  dependencies?: string[];
  handlerCallingSentence: string;
}

export interface IUseRefOptions {
  initialValueStr: any;
  valueType: string;
  name: string;
}

export interface IImportInfo {
  [importPath: string]: {
    [importType: string]: string[];
  };
}

export interface IDSLStatsInfo {
  [key: string]: any;

  pageName: string;
  importInfo: IImportInfo;
  stateInfo: {
    [stateName: string]: IUseStateOptions;
  };
  memoInfo: {
    [memoName: string]: IUseMemoOptions;
  };
  effectInfo: {
    [effectName: string]: IUseEffectOptions;
  };
  callbackInfo: {
    [callbackName: string]: IUseCallbackOptions;
  };
  handlerInfo: {
    [handlerName: string]: IFunctionOptions;
  };
  actionInfo: {
    [handlerName: string]: IFunctionOptions;
  };
  constantInfo: {
    [constantName: string]: IConstantOptions;
  };
  tsxInfo: ITSXOptions | null;
}

export default class ReactCodeGenerator {
  constructor(dsl: IPageSchema, tsCodeGenerator: TypeScriptCodeGenerator) {
    this.dsl = dsl;
    this.tsCodeGenerator = tsCodeGenerator;
  }

  dsl: IPageSchema;

  tsCodeGenerator: TypeScriptCodeGenerator;

  generateTSX(opt: ITSXOptions, sentences: string[] = []): string[] {
    // 如果 text 字段是真值，说明这个节点本身是纯文本
    if (opt.text) {
      return [opt.text];
    }
    const { propsStrArr = [], componentName, children = [] } = opt as unknown as ITSXOptions;
    const startTagStr = `<${componentName}${propsStrArr?.length ? ' ' : ''}${propsStrArr.join(' ')} ${
      children?.length ? '' : '/'
    }>`;
    sentences.push(startTagStr);
    if (children?.length) {
      children?.forEach(child => {
        this.generateTSX(child).forEach(item => {
          sentences.push(item);
        });
      });
      const closeTagStr = `</${componentName}>`;
      sentences.push(closeTagStr);
    }
    return sentences;
  }

  generatePropsStrWithLiteral(opt: IPropsOptions): string {
    const { name, variableType, value } = opt;
    if (variableType === 'string') {
      return `${name}="${value}"`;
    }
    return `${name}={${value}}`;
  }

  generatePropAssignmentExpWithVariable(opt: IPropsOptions): string {
    const { name, variableName } = opt;
    return `${name}={${variableName}}`;
  }

  generateUseEffect(opt: IUseEffectOptions): string[] {
    const { handlerCallingSentence, dependencies } = opt;
    const result: string[] = [];
    const useEffectHeadStr = 'useEffect(() => {';
    result.push(useEffectHeadStr);
    result.push(handlerCallingSentence);
    const dependenciesStr = this.generateDependenciesSentence(dependencies);
    const tailSentence = `}${dependenciesStr ? ', ' : ''}${dependenciesStr});`;
    result.push(tailSentence);
    return result;
  }

  generateUseState(opt: IUseStateOptions): string {
    const { initialValue, valueType, name } = opt;
    return `const [${name}, set${toUpperCase(name)}] = useState<${valueType === 'array' ? 'any[]' : valueType}>(${
      valueType === 'string' ? `'${initialValue}'` : initialValue
    });`;
  }

  generateUseMemo(opt: IUseMemoOptions) {
    const { handlerCallingSentence, dependencies } = opt;
    const result: string[] = [];
    const useEffectHeadStr = 'useMemo(() => {';
    result.push(useEffectHeadStr);
    result.push(`return ${handlerCallingSentence}`);
    const dependenciesStr = this.generateDependenciesSentence(dependencies);
    const tailSentence = `}${dependenciesStr ? ', ' : ''}${dependenciesStr});`;
    result.push(tailSentence);
    return result;
  }

  generateDependenciesSentence(dependencies: string[] | undefined): string {
    if (!dependencies) {
      return '';
    }
    return `[${dependencies.join(', ')}]`;
  }

  // TODO 半成品，需要 DSL 补充函数类 props 的签名
  generateUseCallback(opt: IUseCallbackOptions) {
    return this.generateUseMemo(opt);
  }

  generateUseRef(opt: IUseRefOptions) {
    const { initialValueStr, valueType, name } = opt;
    return `const ${name}Ref = useRef<${valueType}>(${
      valueType === 'string' ? `'${initialValueStr}'` : initialValueStr
    });`;
  }

  analysisDsl(): IDSLStatsInfo {
    const { child, props, httpService, actions, handlers, name, desc } = this.dsl;
    // 初始化 tsxInfo，后边在这个 children 里边去遍历填充子节点信息
    const result = this.analysisTemplate(child, props);
    result.pageName = name;
    return <IDSLStatsInfo>result;
  }

  extractImportInfo(
    dependency: string,
    importType: ImportType | undefined,
    importRelativePath: string | undefined,
    name: string
  ): { importName: string; importPath?: string; importType?: ImportType } {
    const result: { importName: string; importPath?: string; importType?: ImportType } = {
      importName: name,
      importType
    };
    if (importType === undefined) {
      if (importRelativePath) {
        result.importType = 'default';
      } else {
        result.importType = 'object';
      }
    }
    result.importPath = this.tsCodeGenerator.calculateImportPath(dependency, importRelativePath);
    return result;
  }

  analysisTemplate(
    templateRef: ComponentSchemaRef,
    propsDict: {
      [key: string]: { [key: string]: IPropsSchema };
    }
  ) {
    const { componentIndexes } = this.dsl;
    const template = componentIndexes[templateRef.current];
    if (!template) {
      debugger;
    }
    const result: Partial<IDSLStatsInfo> = {
      importInfo: {
        react: {
          default: ['React'],
          object: []
        }
      },
      stateInfo: {},
      memoInfo: {},
      callbackInfo: {},
      effectInfo: {},
      constantInfo: {},
      tsxInfo: {
        componentName: template.callingName || template.name,
        propsStrArr: [],
        children: []
      }
    };
    // 初始化 tsxInfo，后边在这个 children 里边去遍历填充子节点信息

    // 广度遍历 components，获取其中的导入信息和 props
    let q: ComponentSchemaRef[] = [templateRef];
    let p: ITSXOptions[] = [result.tsxInfo as ITSXOptions];
    while (q.length) {
      // 弹出头部的节点
      const nodeRef: ComponentSchemaRef = q.shift() as ComponentSchemaRef;
      if (nodeRef) {
        const node = componentIndexes[nodeRef.current];
        const pNode = p.shift();

        if (nodeRef.isText) {
          if (pNode) {
            pNode.text = nodeRef.current;
          }
        } else {
          const {
            callingName,
            importType,
            dependency,
            importRelativePath,
            name,
            propsRefs = [],
            children = [],
            id
          } = node as IComponentSchema;

          // 提取导入信息
          if (dependency && dependency !== 'html') {
            const importInfoForComponent = this.extractImportInfo(dependency, importType, importRelativePath, name);
            if (importInfoForComponent.importPath && result.importInfo) {
              result.importInfo[importInfoForComponent.importPath] = result.importInfo[
                importInfoForComponent.importPath
              ] || {
                [importInfoForComponent.importType as string]: []
              };
              if (
                !result.importInfo[importInfoForComponent.importPath][
                  importInfoForComponent.importType as string
                ]?.includes(name)
              ) {
                result.importInfo[importInfoForComponent.importPath][importInfoForComponent.importType as string]?.push(
                  name
                );
              }
            }
          }

          // 提取 props
          if (pNode) {
            pNode.componentName = callingName || name;
            // 处理当前节点的 props
            if (propsDict[id]) {
              const { importInfo, propsStrArr, stateInfo, callbackInfo, memoInfo, effectInfo, constantInfo } =
                this.analysisProps(propsDict, propsRefs, node as IComponentSchema);
              pNode.propsStrArr = propsStrArr;
              // 将每个组件节点的 stateInfo 合并到 result 中，通过命名系统避免 state 重名，callback，memo，effect 亦然
              Object.assign(result.stateInfo as object, stateInfo);
              Object.assign(result.callbackInfo as object, callbackInfo);
              Object.assign(result.memoInfo as object, memoInfo);
              Object.assign(result.effectInfo as object, effectInfo);
              Object.assign(result.constantInfo as object, constantInfo);
              if (result.importInfo) {
                const { object } = result.importInfo.react;
                if (Object.entries(effectInfo).length && !object.includes('useEffect')) {
                  object.push('useEffect');
                }
                if (Object.entries(stateInfo).length && !object.includes('useState')) {
                  object.push('useState');
                }
                if (Object.entries(memoInfo).length && !object.includes('useMemo')) {
                  object.push('useMemo');
                }
                if (Object.entries(callbackInfo).length && !object.includes('useCallback')) {
                  object.push('useCallback');
                }
                // 合并导入信息
                this.mergeImportInfo(result.importInfo, importInfo);
              }
            }
            // 初始化子节点
            pNode.children = children.map(() => {
              return {
                componentName: '',
                propsStrArr: [],
                children: []
              };
            });
            p = p.concat(pNode.children);
          }

          q = q.concat(children || []);
        }
      } else {
        result.tsxInfo = null;
      }
    }
    return result;
  }

  analysisProps(
    propsDict: { [key: string]: { [key: string]: IPropsSchema } },
    propsRefs: string[],
    component: IComponentSchema
  ): {
    importInfo: {
      [importPath: string]: {
        [importType: string]: string[];
      };
    };
    propsStrArr: string[];
    stateInfo: { [stateName: string]: IUseStateOptions };
    callbackInfo: { [callbackName: string]: IUseCallbackOptions };
    memoInfo: { [memoName: string]: IUseMemoOptions };
    effectInfo: { [effectName: string]: IUseEffectOptions };
    constantInfo: { [constantName: string]: IConstantOptions };
  } {
    // TODO 暂时改为 any，跑通后再修改为真实类型
    const result: any = {
      importInfo: {},
      propsStrArr: [],
      stateInfo: {},
      memoInfo: {},
      callbackInfo: {},
      effectInfo: {},
      constantInfo: {}
    };

    const { id: componentId } = component;

    const componentPropsDict = propsDict[componentId];

    propsRefs.forEach(ref => {
      const props = componentPropsDict[ref];
      // 找不到的 ref 跳过
      if (!props) {
        return;
      }
      const { value, valueType, valueSource, isValue, templateKeyPathsReg = [], name } = props;
      const basicValueTypes = ['string', 'number', 'boolean'];
      // 基础类型固定值走字面，其他情况走变量（常量、state、memo、callback）
      if (valueSource === 'editorInput') {
        if (basicValueTypes.includes(valueType)) {
          result.propsStrArr.push(
            this.generatePropsStrWithLiteral({
              name: ref,
              value: value.toString(),
              variableType: valueType
            })
          );
        } else {
          if (templateKeyPathsReg.length) {
            const variableName = this.generateVariableName(componentId, name, 'const');
            result.propsStrArr.push(
              this.generatePropAssignmentExpWithVariable({
                name: ref,
                variableName,
                variableType: valueType
              })
            );

            // 模板使用嵌套
            if (result.constantInfo) {
              result.constantInfo[variableName] = {
                name: variableName,
                value: this.tsCodeGenerator.generateObjectStrArr(
                  value,
                  templateKeyPathsReg,
                  (val: ComponentSchemaRef, wrapper: string[] = [], insertIndex = 0) => {
                    const { tsxInfo, importInfo, effectInfo, constantInfo, memoInfo, callbackInfo, stateInfo } =
                      this.analysisTemplate(val, propsDict);
                    // 合并统计分析
                    Object.assign(result.stateInfo as object, stateInfo);
                    Object.assign(result.callbackInfo as object, callbackInfo);
                    Object.assign(result.memoInfo as object, memoInfo);
                    Object.assign(result.effectInfo as object, effectInfo);
                    Object.assign(result.constantInfo as object, constantInfo);
                    if (importInfo) {
                      // 合并 hooks
                      const { object } = importInfo.react;
                      if (
                        result.effectInfo &&
                        Object.entries(result.effectInfo).length &&
                        !object.includes('useEffect')
                      ) {
                        object.push('useEffect');
                      }
                      if (result.stateInfo && Object.entries(result.stateInfo).length && !object.includes('useState')) {
                        object.push('useState');
                      }
                      if (result.memoInfo && Object.entries(result.memoInfo).length && !object.includes('useMemo')) {
                        object.push('useMemo');
                      }
                      if (
                        result.callbackInfo &&
                        Object.entries(result.callbackInfo).length &&
                        !object.includes('useCallback')
                      ) {
                        object.push('useCallback');
                      }
                      this.mergeImportInfo(result.importInfo, importInfo);
                    }

                    if (tsxInfo) {
                      const tsxSentences = this.generateTSX(tsxInfo);
                      // 这里如果存在 wrapper ，则按照插入索引的位置，插入 tsx 代码
                      if (wrapper.length) {
                        const cp = [...wrapper];
                        cp.splice(insertIndex, 0, ...tsxSentences);
                        return cp;
                      }
                      return tsxSentences;
                    }
                    return [];
                  }
                )
              };
            }
          } else {
            const variableName = this.generateVariableName(componentId, name, 'state');
            result.propsStrArr.push(
              this.generatePropAssignmentExpWithVariable({
                name: ref,
                variableName,
                variableType: valueType
              })
            );
            // 变量需要转为 state
            if (result.stateInfo) {
              result.stateInfo[variableName] = {
                name: variableName,
                initialValue: this.tsCodeGenerator.generateObjectStrArr(value).join(' '),
                valueType
              };
            }
          }
        }
      } else if (valueSource === 'handler') {
        // TODO: 生成 useCallback
        const variableName = this.generateVariableName(componentId, name, 'state');
        if (result.callbackInfo) {
          result.callbackInfo[variableName] = {
            dependencies: [],
            handlerCallingSentence: `() => { console.log('useCallback ${variableName} works!'); }`
          };
        }
      } else if (valueSource === 'computed') {
        // TODO:  生成 useMemo
        const variableName = this.generateVariableName(componentId, name, 'state');
        if (result.memoInfo) {
          result.memoInfo[variableName] = {
            dependencies: [],
            handlerCallingSentence: `() => { console.log('useMemo ${variableName} works!'); }`
          };
        }
      } else {
        const variableName = this.generateVariableName(componentId, name, 'state');
        result.propsStrArr.push(
          this.generatePropAssignmentExpWithVariable({
            name: ref,
            variableName,
            variableType: valueType
          })
        );
        // 使用状态的变量
        if (result.stateInfo) {
          result.stateInfo[variableName] = {
            name: variableName,
            initialValue: basicValueTypes.includes(valueType)
              ? value
              : this.tsCodeGenerator.generateObjectStrArr(value).join(' '),
            valueType
          };
        }
      }

      // 如果这个属性是 value，那么自动生成 useEffect
      if (isValue) {
        const variableName = this.generateVariableName(componentId, name, 'state');
        // 填充 effectInfo
        if (result.effectInfo) {
          result.effectInfo[variableName] = {
            dependencies: [variableName],
            handlerCallingSentence: `console.log('useEffect ${variableName} works!');`
          };
        }
      }
    });
    return result;
  }

  generateVariableName(componentId: string, propsName: string, prefix: string): string {
    return `${propsName}${toUpperCase(prefix)}Of${toUpperCase(componentId)}`;
  }

  generatePageCode(): string[] {
    let result: string[] = [];
    const {
      pageName = 'index',
      stateInfo,
      effectInfo,
      callbackInfo,
      memoInfo,
      constantInfo,
      importInfo,
      tsxInfo
    } = this.analysisDsl();

    // 生成导入语句
    Object.entries(importInfo).forEach(([importPath, item]) => {
      Object.entries(item).forEach(([importType, importNames]) => {
        const importSentence = this.tsCodeGenerator.generateImportSentence({
          importNames,
          importPath,
          importType: importType as ImportType
        });
        if (importSentence) {
          result.push(importSentence);
        }
      });
    });
    const functionInfo = {
      functionName: toUpperCase(pageName),
      functionParams: [],
      useArrow: false,
      useAsync: false,
      exportType: 'default',
      body: [
        ...Object.values(stateInfo).map(i => this.generateUseState(i)),
        ...Object.values(effectInfo)
          .map(i => this.generateUseEffect(i))
          .flat(2),
        ...Object.values(memoInfo)
          .map(i => this.generateUseMemo(i))
          .flat(2),
        ...Object.values(callbackInfo)
          .map(i => this.generateUseCallback(i))
          .flat(2),
        ...Object.values(constantInfo)
          .map(i =>
            this.tsCodeGenerator.generateAssignment({
              variableName: i.name,
              expressions: i.value
            })
          )
          .flat(2)
      ]
    };
    if (tsxInfo === null) {
      functionInfo.body.push(`return null;`);
    } else {
      functionInfo.body.push('return (');
      functionInfo.body = functionInfo.body.concat(this.generateTSX(tsxInfo));
      functionInfo.body.push(');');
    }
    result = result.concat(this.tsCodeGenerator.generateFunctionDefinition(functionInfo as IFunctionOptions));

    return result;
  }

  private mergeImportInfo(source: IImportInfo, target: IImportInfo) {
    Object.entries(target).forEach(
      ([importPath, importInfo]: [
        string,
        {
          [key: string]: string[];
        }
      ]) => {
        if (!source[importPath]) {
          source[importPath] = {};
        }
        if (!source[importPath].default) {
          source[importPath].default = [];
        }
        importInfo?.default?.forEach(item => {
          if (!(source?.[importPath]?.default || []).includes(item)) {
            source?.[importPath]?.default.push(item);
          }
        });

        if (!source[importPath].object) {
          source[importPath].object = [];
        }
        importInfo?.object?.forEach(item => {
          if (!(source?.[importPath]?.object || []).includes(item)) {
            source?.[importPath]?.object.push(item);
          }
        });

        if (!source[importPath]['*']) {
          source[importPath]['*'] = [];
        }
        importInfo?.['*']?.forEach(item => {
          if (!(source?.[importPath]?.['*'] || []).includes(item)) {
            source?.[importPath]?.['*'].push(item);
          }
        });
      }
    );
  }
}
