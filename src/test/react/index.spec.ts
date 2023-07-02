import { describe, expect } from '@jest/globals';
import ReactCodeGenerator, {
  IPropsOptions,
  ITSXOptions,
  IUseEffectOptions,
  IUseMemoOptions,
  IUseRefOptions,
  IUseStateOptions
} from '@/service/code-generator/react';
import IPageSchema from '@/types/page.schema';
import * as dsl from '@/mock/tab-case.json';
import TypeScriptCodeGenerator from '@/service/code-generator/typescript';
import { ImportType } from '@/types';

describe('react', () => {
  const react = new ReactCodeGenerator(dsl as unknown as IPageSchema, new TypeScriptCodeGenerator());
  test('should return props string', () => {
    const propsOpt: IPropsOptions = {
      name: 'title',
      variableName: 'buttonTitle',
      variableType: 'string',
      variableValueSource: 'editorInput'
    };
    expect(react.generatePropStrWithVariable(propsOpt)).toStrictEqual('title={buttonTitle}');
  });
  test('should return template sentences array', () => {
    const tsx: ITSXOptions = {
      componentName: 'div',
      children: [
        {
          componentName: 'Button',
          propsStrArr: ['title={buttonTitle}', 'onClick={handleClicking}']
        },
        {
          componentName: 'Input.Search',
          propsStrArr: ['value={inputValue}']
        },
        {
          componentName: 'div',
          children: [
            {
              componentName: 'div'
            },
            {
              componentName: 'p'
            }
          ]
        }
      ]
    };
    expect(react.generateTSX(tsx)).toStrictEqual([
      '<div >',
      '  <Button title={buttonTitle} onClick={handleClicking} />',
      '  <Input.Search value={inputValue} />',
      '  <div >',
      '    <div />',
      '    <p />',
      '  </div>',
      '</div>'
    ]);
  });
  test('should return use effect hook sentence array', () => {
    const effectOpt: IUseEffectOptions = {
      handlerCallingSentence: 'fetchData().then();',
      dependencies: ['value']
    };
    expect(react.generateUseEffect(effectOpt)).toStrictEqual([
      'useEffect(() => {',
      'fetchData().then();',
      '}, [value]);'
    ]);
  });
  test('should return use effect hook sentence array with no dependencies', () => {
    const effectOpt: IUseEffectOptions = {
      handlerCallingSentence: 'fetchData().then();',
      dependencies: []
    };
    expect(react.generateUseEffect(effectOpt)).toStrictEqual(['useEffect(() => {', 'fetchData().then();', '}, []);']);
  });
  test('should return use effect hook sentence array with no dependencies 2', () => {
    const effectOpt: IUseEffectOptions = {
      handlerCallingSentence: 'fetchData().then();'
    };
    expect(react.generateUseEffect(effectOpt)).toStrictEqual(['useEffect(() => {', 'fetchData().then();', '});']);
  });
  test('test boolean', () => {
    const stateOpt: IUseStateOptions = {
      initialValueStr: true,
      valueType: 'boolean',
      name: 'testValue'
    };
    expect(react.generateUseState(stateOpt)).toStrictEqual(
      'const [testValue, setTestValue] = useState<boolean>(true);'
    );
  });
  test('test number', () => {
    const stateOpt: IUseStateOptions = {
      initialValueStr: 123,
      valueType: 'number',
      name: 'testValue'
    };
    expect(react.generateUseState(stateOpt)).toStrictEqual('const [testValue, setTestValue] = useState<number>(123);');
  });
  test('test string', () => {
    const stateOpt: IUseStateOptions = {
      initialValueStr: 'hello world',
      valueType: 'string',
      name: 'testValue'
    };
    expect(react.generateUseState(stateOpt)).toStrictEqual(
      "const [testValue, setTestValue] = useState<string>('hello world');"
    );
  });

  test('test use memo with dependencies', () => {
    const memoOpt: IUseMemoOptions = {
      dependencies: ['state1', 'state2'],
      handlerCallingSentence: 'handleChanging(state1, state2);'
    };
    expect(react.generateUseMemo(memoOpt)).toStrictEqual([
      'useMemo(() => {',
      'return handleChanging(state1, state2);',
      '}, [state1, state2]);'
    ]);
  });

  test('test dependencies generator', () => {
    const deps: string[] = [];
    expect(react.generateDependenciesSentence(deps)).toBe('[]');
  });

  test('test use ref', () => {
    const opt: IUseRefOptions = {
      initialValueStr: '1',
      valueType: 'string',
      name: 'test'
    };
    expect(react.generateUseRef(opt)).toBe("const testRef = useRef<string>('1');");
  });
});

describe('dsl analysis', () => {
  const react = new ReactCodeGenerator(dsl as unknown as IPageSchema, new TypeScriptCodeGenerator());
  test('extract import info', () => {
    expect(react.analysisDsl().importInfo).toStrictEqual({
      antd: {
        object: ['Input', 'Select']
      },
      'antd/es/Table': {
        default: ['Table']
      },
      'antd/es/Tab': {
        object: ['Tab']
      }
    });
  });

  test('import info to import sentences', () => {
    const { importInfo } = react.analysisDsl();
    let s: string[] = [];
    Object.entries(importInfo).forEach(([importPath, importObject]) => {
      Object.entries(importObject).forEach(([importType, importNames]) => {
        s = s.concat(
          react.tsCodeGenerator.generateImportSentence({
            importNames,
            importType: importType as ImportType,
            importPath
          })
        );
      });
    });
    expect(s).toStrictEqual([
      "import { Tab } from 'antd/es/Tab';",
      "import Table from 'antd/es/Table';",
      "import { Input, Select } from 'antd';"
    ]);
  });
});
