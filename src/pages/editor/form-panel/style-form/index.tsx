import { Divider, Popover, Select, Tooltip } from 'antd';
import classNames from 'classnames';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import NumberInput from '@/pages/editor/form-panel/style-form/components/number-input';

import {
  AlignCenter,
  AlignStart,
  Arrow,
  Bold,
  Border2,
  ColumnLayout,
  ColumnSpaceAround,
  ColumnSpaceBetween,
  Compact,
  DashedLine,
  Fixed,
  Gap,
  Grow,
  Height,
  Italic,
  Line,
  LineThrough,
  LongBar,
  NoWrap,
  Padding,
  PlusThin,
  RowSpaceBetween,
  ShortBar,
  SingleBorder,
  SpaceAround,
  Start,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  Thickness,
  UnderLine,
  Width,
  Wrap
} from '@/components/icon';
import styles from './index.module.less';
import { StyleFormConfig } from '@/types';
import { isDifferent } from '@/util';

export interface IStyleFormProps {
  config?: StyleFormConfig;
  onChange: (style: CSSProperties) => void;
  parentDirection: 'row' | 'column';
  value?: CSSProperties;
}

enum ItemsAlignment {
  topLeft,
  top,
  topRight,
  left,
  center,
  right,
  bottomLeft,
  bottom,
  bottomRight
}

enum ItemsAlignment2 {
  top,
  center,
  bottom
}

type SpaceArrangement = 'sequence' | 'space-around' | 'space-between';

type TextAlignment = 'left' | 'right' | 'center' | 'justify';

type SizeMode = 'hug' | 'fill' | 'fixed';

const itemsAlignmentDict = {
  [ItemsAlignment.topLeft]: {
    alignItems: 'start',
    justifyContent: 'start'
  },
  [ItemsAlignment.top]: {
    alignItems: 'start',
    justifyContent: 'center'
  },
  [ItemsAlignment.topRight]: {
    alignItems: 'start',
    justifyContent: 'end'
  },
  [ItemsAlignment.left]: {
    alignItems: 'center',
    justifyContent: 'start'
  },
  [ItemsAlignment.center]: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  [ItemsAlignment.right]: {
    alignItems: 'center',
    justifyContent: 'end'
  },
  [ItemsAlignment.bottomLeft]: {
    alignItems: 'end',
    justifyContent: 'start'
  },
  [ItemsAlignment.bottom]: {
    alignItems: 'end',
    justifyContent: 'center'
  },
  [ItemsAlignment.bottomRight]: {
    alignItems: 'end',
    justifyContent: 'end'
  }
};

const textSizeOptions = [
  {
    fontSize: 24,
    lineHeight: '36px',
    name: 'text-hugtitle · 24/36'
  },
  {
    fontSize: 18,
    lineHeight: '27px',
    name: 'text-h1 · 18/27'
  },
  {
    fontSize: 16,
    lineHeight: '24px',
    name: 'text-h2 · 16/24'
  },
  {
    fontSize: 14,
    lineHeight: '21px',
    name: 'text-h3 · 14/21'
  },
  {
    fontSize: 13,
    lineHeight: '20px',
    name: 'text-h4 · 13/20'
  },
  {
    fontSize: 16,
    lineHeight: '29px',
    name: 'text-body-lg · 16/29'
  },
  {
    fontSize: 14,
    lineHeight: '25px',
    name: 'text-body-md · 14/25'
  },
  {
    fontSize: 13,
    lineHeight: '20px',
    name: 'text-description · 13/20'
  }
];

const textColorOptions = [
  {
    category: '',
    data: [
      {
        name: '一级色字符/colorSymbolBase',
        value: 'rgb(24, 25, 28)'
      },
      {
        name: '二级色字符/colorSymbolBold',
        value: 'rgb(97, 102, 109)'
      },
      {
        name: '三级色字符/colorSymbolMedium',
        value: 'rgb(148, 153, 160)'
      },
      {
        name: '四级色字符/colorSymbolLight',
        value: 'rgb(201, 204, 208)'
      },
      {
        name: '绝对白色字符/colorSymbolWhite',
        value: 'rgb(255, 255, 255)'
      },
      {
        name: '链接色/colorLink',
        value: 'rgb(0, 105, 157)'
      }
    ]
  }
];

const indicatingColors = [
  {
    category: '主色',
    data: [
      {
        name: '主色/colorPrimary',
        value: '#00aeecff'
      },
      {
        name: '主色/colorPrimaryHover',
        value: '#00aeecbf'
      },
      {
        name: '主色/colorPrimaryActive',
        value: '#008ac5ff'
      },
      {
        name: '主色/colorPrimaryDisabled',
        value: '#00aeec80'
      },
      {
        name: '主色/colorPrimaryHighlight',
        value: '#00aeec14'
      }
    ]
  },
  {
    category: '成功',
    data: [
      {
        name: '成功/colorSuccess',
        value: '#2ac864ff'
      },
      {
        name: '成功/colorSuccessHover',
        value: '#2ac864bf'
      },
      {
        name: '成功/colorSuccessActive',
        value: '#0eb350ff'
      },
      {
        name: '成功/colorSuccessDisabled',
        value: '#2ac864bf'
      },
      {
        name: '成功/colorSuccessHighlight',
        value: '#2ac86414'
      }
    ]
  },
  {
    category: '警示',
    data: [
      {
        name: '警示/colorWarning',
        value: '#ff7f24ff'
      },
      {
        name: '警示/colorWarningHover',
        value: '#ff7f24bf'
      },
      {
        name: '警示/colorWarningActive',
        value: '#e95b03ff'
      },
      {
        name: '警示/colorWarningDisabled',
        value: '#ff7f2480'
      },
      {
        name: '警示/colorWarningHighlight',
        value: '#2ac86414'
      }
    ]
  },
  {
    category: '错误',
    data: [
      {
        name: '错误/colorError',
        value: '#f85a54ff'
      },
      {
        name: '错误/colorErrorHover',
        value: '#f85a54bf'
      },
      {
        name: '错误/colorErrorActive',
        value: '#e23d3dff'
      },
      {
        name: '错误/colorErrorDisabled',
        value: '#f85a5480'
      },
      {
        name: '错误/colorErrorHighlight',
        value: '#f85a5414'
      }
    ]
  }
];

const colors = [
  {
    category: '背景',
    data: [
      {
        name: '一级白色/colorBgBase',
        value: 'rgb(255, 255, 255)'
      },
      {
        name: '二级亮灰/colorBgBright',
        value: 'rgb(246, 247, 248)'
      },
      {
        name: '三级灰色/colorBgLight',
        value: 'rgb(241, 242, 243)'
      },
      {
        name: '灰色控件/colorBgWeak',
        value: 'rgb(227, 229, 231)'
      },
      {
        name: '雪白控件/colorBgSnow',
        value: 'rgb(255, 255, 255)'
      },
      {
        name: '绝对白色/colorBgWhite',
        value: 'rgb(255, 255, 255)'
      },
      {
        name: '凹陷的亮灰/colorBgSunkenBright',
        value: 'rgb(246, 247, 248)'
      },
      {
        name: '凹陷的灰色/colorBgSunkenLight',
        value: 'rgb(241, 242, 243)'
      },
      {
        name: '浮层一级/colorFloat',
        value: 'rgb(246, 247, 248)'
      },
      {
        name: '浮层二级/colorFloatSecondary',
        value: 'rgb(246, 247, 248)'
      },
      {
        name: '浮层三级/colorFloatTertiary',
        value: 'rgb(246, 247, 248)'
      },
      {
        name: '浮层深色/colorFloatDark',
        value: 'rgb(246, 247, 248)'
      },
      {
        name: '重遮罩/colorMaskBold',
        value: 'rgb(246, 247, 248)'
      },
      {
        name: '默认遮罩/colorMask',
        value: 'rgb(246, 247, 248)'
      },
      {
        name: '轻遮罩/colorMaskLight',
        value: 'rgb(246, 247, 248)'
      }
    ]
  },
  ...indicatingColors
];

const borderOpt = [
  {
    category: '',
    data: [
      {
        value: 'rgb(201, 204, 208)',
        name: '重线框/colorBorderBold'
      },
      {
        value: 'rgb(227, 229, 231)',
        name: '默认线框/colorBorder'
      },
      {
        value: 'rgb(241, 242, 243)',
        name: '浅线框/colorBorderLight'
      }
    ]
  }
];

export default function StyleForm({ onChange, value, config, parentDirection }: IStyleFormProps) {
  const [fillVisible, setFillVisible] = useState<boolean>();
  const [borderVisible, setBorderVisible] = useState<boolean>();
  const [shadowVisible, setShadowVisible] = useState<boolean>(false);
  const [fillColorObj, setFillColorObj] = useState<{
    name: string;
    value: string;
  }>();
  const [borderColorObj, setBorderColorObj] = useState<{
    name: string;
    value: string;
  }>();
  const [shadowObj, setShadowObj] = useState<{
    name: string;
    value: string;
  }>();
  const [textColorObj, setTextColorObj] = useState<{
    name: string;
    value: string;
  }>();

  const [textSizeObj, setTextSizeObj] = useState<{
    fontSize: number;
    lineHeight: string;
    name: string;
  }>();

  const [borderType, setBorderType] = useState<string>();

  const [itemsAlignmentState, setItemsAlignmentState] = useState<ItemsAlignment | ItemsAlignment2>();

  const [spaceArrangement, setSpaceArrangement] = useState<SpaceArrangement>();

  const [fillOpen, setFillOpen] = useState<boolean>(false);
  const [borderOpen, setBorderOpen] = useState<boolean>(false);
  const [shadowOpen, setShadowOpen] = useState<boolean>(false);
  const [textOpen, setTextOpen] = useState<boolean>(false);
  const [textColorOpen, setTextColorOpen] = useState<boolean>(false);
  const [borderWidth, setBorderWidth] = useState<number>();
  const [borderStyle, setBorderStyle] = useState<'solid' | 'dashed'>();

  const [widthSizeMode, setWidthSizeMode] = useState<SizeMode>();
  const [heightSizeMode, setHeightSizeMode] = useState<SizeMode>();

  // 上次的value值
  const oldValueRef = useRef<Record<string, any>>(value);

  useEffect(() => {
    // if (!isDifferent(oldValueRef.current, value)) {
    //   return;
    // }
    // oldValueRef.current = value;
    // 初始化表单值
    const { flexGrow, alignSelf, width, height, color, borderColor, backgroundColor, fontSize, lineHeight } = value;
    // 设置背景色
    const allColorsOpt = [];
    colors.forEach(color => {
      color.data.forEach(item => {
        allColorsOpt.push(item);
      });
    });
    const backgroundColorOpt = allColorsOpt.find(item => item.value === backgroundColor);
    if (backgroundColorOpt) {
      setFillVisible(true);
      setFillColorObj(backgroundColorOpt);
    } else {
      setFillVisible(false);
    }
    // 设置线框
    const allBorderOpt = [];
    borderOpt.forEach(color => {
      color.data.forEach(item => {
        allBorderOpt.push(item);
      });
    });
    const borderColorOpt = allBorderOpt.find(item => item.value === borderColor);
    if (borderColorOpt) {
      setBorderVisible(true);
      setBorderColorObj(borderColorOpt);
    } else {
      setBorderVisible(false);
    }

    const borderTypes = ['border', 'borderLeft', 'borderTop', 'borderRight', 'borderBottom'];
    for (const key of borderTypes) {
      if (`${key}Width` in value) {
        setBorderType(key);
        setBorderWidth(value[`${key}Width`]);
      }
      if (`${key}Style` in value) {
        setBorderStyle(value[`${key}Style`]);
      }
    }

    // 设置文字大小
    const opt = textSizeOptions.find(item => item.fontSize === fontSize && item.lineHeight === lineHeight);
    if (opt) {
      setTextSizeObj(opt);
    } else {
      setTextSizeObj(undefined);
    }
    const allTextColors = [];
    textColorOptions.forEach(category => {
      category.data.forEach(item => allTextColors.push(item));
    });
    const textColorOpt = allTextColors.find(item => item.value === color);
    if (textColorOpt) {
      setTextColorObj(textColorOpt);
    } else {
      setTextSizeObj(undefined);
    }

    // 如果是方向是 row, 判断flexGrow，
    if ((parentDirection === 'row' && flexGrow > 0) || (parentDirection === 'column' && alignSelf === 'stretch')) {
      setWidthSizeMode('fill');
    } else if (width > 0) {
      setWidthSizeMode('fixed');
    } else {
      setWidthSizeMode('hug');
    }

    if ((parentDirection === 'column' && flexGrow > 0) || (parentDirection === 'row' && alignSelf === 'stretch')) {
      setHeightSizeMode('fill');
    } else if (height > 0) {
      setHeightSizeMode('fixed');
    } else {
      setHeightSizeMode('hug');
    }
  }, [value]);

  function doChange(newValue: Record<string, any>) {
    if (isDifferent(newValue, oldValueRef.current)) {
      onChange(newValue);
      oldValueRef.current = newValue;
    }
  }

  useEffect(() => {
    const borderTypes = ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft'];
    for (const key of borderTypes) {
      if (value[`${key}Width`] > 0) {
        handleChangingBorderWidth(value[`${key}Width`]);
      }
      if (value[`${key}Style`]) {
        handleSelectingBorderStyle(value[`${key}Style`]);
      }
    }
  }, [borderType]);

  function handleChangeSize(val: number | string, type: 'width' | 'height') {
    const newValueState = value ? { ...value } : {};

    if (parentDirection === 'row') {
      if (type === 'width') {
        delete newValueState.flexGrow;
      } else {
        delete newValueState.alignSelf;
      }
    } else {
      if (type === 'width') {
        delete newValueState.alignSelf;
      } else {
        delete newValueState.flexGrow;
      }
    }

    newValueState[type] = val;

    if (onChange) {
      doChange(newValueState);
    }
  }

  function handleSelectingSpaceArrangement(val: SpaceArrangement) {
    setSpaceArrangement(val);
  }

  function renderItemsAlignment() {
    const { direction } = value;
    let tpl: JSX.Element;

    const iconClassObj = {
      [styles.icon]: true,
      [styles.f20]: true
    };

    if ((direction as string) === 'row') {
      tpl = (
        <>
          <Start
            className={classNames({ ...iconClassObj, [styles.iconSelected]: spaceArrangement === 'sequence' })}
            onClick={() => handleSelectingSpaceArrangement('sequence')}
          />
          <RowSpaceBetween
            className={classNames({ ...iconClassObj, [styles.iconSelected]: spaceArrangement === 'space-around' })}
            onClick={() => handleSelectingSpaceArrangement('space-around')}
          />
          <SpaceAround
            className={classNames({ ...iconClassObj, [styles.iconSelected]: spaceArrangement === 'space-between' })}
            onClick={() => handleSelectingSpaceArrangement('space-between')}
          />
        </>
      );
    } else {
      tpl = (
        <>
          <ColumnLayout
            className={classNames({ ...iconClassObj, [styles.iconSelected]: spaceArrangement === 'sequence' })}
            onClick={() => handleSelectingSpaceArrangement('sequence')}
          />
          <ColumnSpaceAround
            className={classNames({ ...iconClassObj, [styles.iconSelected]: spaceArrangement === 'space-around' })}
            onClick={() => handleSelectingSpaceArrangement('space-around')}
          />
          <ColumnSpaceBetween
            className={classNames({ ...iconClassObj, [styles.iconSelected]: spaceArrangement === 'space-between' })}
            onClick={() => handleSelectingSpaceArrangement('space-between')}
          />
        </>
      );
    }
    return <div className={styles.adjustmentContainer}>{tpl}</div>;
  }

  function isStart(key: string) {
    return value[key] === 'start' || value[key] === 'flex-start';
  }

  function isEnd(key: string) {
    return value[key] === 'end' || value[key] === 'flex-end';
  }

  function isCenter(key: string) {
    return value[key] === 'center';
  }

  function handleSelectingItemsAlignment(val: ItemsAlignment | ItemsAlignment2) {
    const { alignItems, justifyContent } = itemsAlignmentDict[val];
    if (onChange) {
      doChange({
        ...value,
        alignItems,
        justifyContent
      });
    }
  }

  function handlePreviewItemsAlignment(val: ItemsAlignment | ItemsAlignment2) {
    setItemsAlignmentState(val);
  }

  function cancelSelectingItemsAlignment() {
    setItemsAlignmentState(undefined);
  }

  // 元素排布的预览九宫格
  function renderAlignmentPreview(direction: 'row' | 'column') {
    const alignmentClass = classNames({
      [styles.rDiagonal180]: direction === 'column',
      [styles.alignmentGrid]: true
    });

    const iconClass = classNames({
      [styles.icon]: true,
      [styles.alignEnd]: true
    });

    return (
      <div className={alignmentClass} onMouseLeave={cancelSelectingItemsAlignment}>
        <div
          onMouseEnter={() => handlePreviewItemsAlignment(ItemsAlignment.topLeft)}
          onClick={() => handleSelectingItemsAlignment(ItemsAlignment.topLeft)}
        >
          {(isStart('alignItems') && isStart('justifyContent')) || itemsAlignmentState === ItemsAlignment.topLeft ? (
            <AlignStart className={styles.icon} />
          ) : (
            <div className={styles.dot} />
          )}
        </div>
        <div
          onMouseEnter={() => handlePreviewItemsAlignment(ItemsAlignment.top)}
          onClick={() => handleSelectingItemsAlignment(ItemsAlignment.top)}
        >
          {(isStart('alignItems') && isCenter('justifyContent')) || itemsAlignmentState === ItemsAlignment.top ? (
            <AlignStart className={styles.icon} />
          ) : (
            <div className={styles.dot} />
          )}
        </div>
        <div
          onMouseEnter={() => handlePreviewItemsAlignment(ItemsAlignment.topRight)}
          onClick={() => handleSelectingItemsAlignment(ItemsAlignment.topRight)}
        >
          {(isStart('alignItems') && isEnd('justifyContent')) || itemsAlignmentState === ItemsAlignment.topRight ? (
            <AlignStart className={styles.icon} />
          ) : (
            <div className={styles.dot} />
          )}
        </div>
        <div
          onMouseEnter={() => handlePreviewItemsAlignment(ItemsAlignment.left)}
          onClick={() => handleSelectingItemsAlignment(ItemsAlignment.left)}
        >
          {(isCenter('alignItems') && isStart('justifyContent')) || itemsAlignmentState === ItemsAlignment.left ? (
            <AlignCenter className={styles.icon} />
          ) : (
            <div className={styles.dot} />
          )}
        </div>
        <div
          onMouseEnter={() => handlePreviewItemsAlignment(ItemsAlignment.center)}
          onClick={() => handleSelectingItemsAlignment(ItemsAlignment.center)}
        >
          {(isCenter('alignItems') && isCenter('justifyContent')) || itemsAlignmentState === ItemsAlignment.center ? (
            <AlignCenter className={styles.icon} />
          ) : (
            <div className={styles.dot} />
          )}
        </div>
        <div
          onMouseEnter={() => handlePreviewItemsAlignment(ItemsAlignment.right)}
          onClick={() => handleSelectingItemsAlignment(ItemsAlignment.right)}
        >
          {(isCenter('alignItems') && isEnd('justifyContent')) || itemsAlignmentState === ItemsAlignment.right ? (
            <AlignCenter className={styles.icon} />
          ) : (
            <div className={styles.dot} />
          )}
        </div>
        <div
          onMouseEnter={() => handlePreviewItemsAlignment(ItemsAlignment.bottomLeft)}
          onClick={() => handleSelectingItemsAlignment(ItemsAlignment.bottomLeft)}
        >
          {(isEnd('alignItems') && isStart('justifyContent')) || itemsAlignmentState === ItemsAlignment.bottomLeft ? (
            <AlignStart className={iconClass} />
          ) : (
            <div className={styles.dot} />
          )}
        </div>
        <div
          onMouseEnter={() => handlePreviewItemsAlignment(ItemsAlignment.bottom)}
          onClick={() => handleSelectingItemsAlignment(ItemsAlignment.bottom)}
        >
          {(isEnd('alignItems') && isCenter('justifyContent')) || itemsAlignmentState === ItemsAlignment.bottom ? (
            <AlignStart className={iconClass} />
          ) : (
            <div className={styles.dot} />
          )}
        </div>
        <div
          onMouseEnter={() => handlePreviewItemsAlignment(ItemsAlignment.bottomRight)}
          onClick={() => handleSelectingItemsAlignment(ItemsAlignment.bottomRight)}
        >
          {(isEnd('alignItems') && isEnd('justifyContent')) || itemsAlignmentState === ItemsAlignment.bottomRight ? (
            <AlignStart className={iconClass} />
          ) : (
            <div className={styles.dot} />
          )}
        </div>
      </div>
    );
  }

  function handleSwitchAlignment() {
    // TODO
  }

  function handlePreviewAlignment() {}

  function renderSpaceAssignmentPreview(direction: 'row' | 'column') {
    const alignmentClass = classNames({
      [styles.rDiagonal180]: direction === 'column',
      [styles.alignmentGrid]: true
    });

    return (
      <div className={alignmentClass}>
        <div onMouseEnter={() => handlePreviewAlignment()}>
          {isStart('alignItems') ? <LongBar className={styles.icon} /> : <div className={styles.dot} />}
        </div>
        <div onMouseEnter={() => handlePreviewAlignment()}>
          {isStart('alignItems') ? <ShortBar className={styles.icon} /> : <div className={styles.dot} />}
        </div>
        <div onMouseEnter={() => handlePreviewAlignment()}>
          {isStart('alignItems') ? <LongBar className={styles.icon} /> : <div className={styles.dot} />}
        </div>
        <div onMouseEnter={() => handlePreviewAlignment()}>
          {isCenter('alignItems') ? <LongBar className={styles.icon} /> : <div className={styles.dot} />}
        </div>
        <div onMouseEnter={() => handlePreviewAlignment()}>
          {isCenter('alignItems') ? <ShortBar className={styles.icon} /> : <div className={styles.dot} />}
        </div>
        <div onMouseEnter={() => handlePreviewAlignment()}>
          {isCenter('alignItems') ? <LongBar className={styles.icon} /> : <div className={styles.dot} />}
        </div>
        <div onMouseEnter={() => handlePreviewAlignment()}>
          {isEnd('alignItems') ? <LongBar className={styles.icon} /> : <div className={styles.dot} />}
        </div>
        <div onMouseEnter={() => handlePreviewAlignment()}>
          {isEnd('alignItems') ? <ShortBar className={styles.icon} /> : <div className={styles.dot} />}
        </div>
        <div onMouseEnter={() => handlePreviewAlignment()}>
          {isEnd('alignItems') ? <LongBar className={styles.icon} /> : <div className={styles.dot} />}
        </div>
      </div>
    );
  }

  function handleSelectingSizeMode(val: SizeMode, type: 'width' | 'height') {
    const newValueState = value ? { ...value } : {};

    switch (val) {
      case 'fill':
        if (parentDirection === 'row') {
          if (type === 'width') {
            newValueState.flexGrow = 1;
            delete newValueState.width;
          } else {
            newValueState.alignSelf = 'stretch';
            delete newValueState.height;
          }
        } else {
          if (type === 'width') {
            newValueState.alignSelf = 'stretch';
            delete newValueState.width;
          } else {
            newValueState.flexGrow = 1;
            delete newValueState.height;
          }
        }
        if (onChange) {
          doChange(newValueState);
        }
        break;
      case 'hug':
        if (parentDirection === 'row') {
          if (type === 'width') {
            delete newValueState.flexGrow;
          } else {
            delete newValueState.alignSelf;
          }
        } else {
          if (type === 'width') {
            delete newValueState.alignSelf;
          } else {
            delete newValueState.flexGrow;
          }
        }
        delete newValueState[type];
        if (onChange) {
          doChange(newValueState);
        }
        break;
      case 'fixed':
        // 技术限制，这里什么也不做
        break;
    }
    if (type === 'width') {
      setWidthSizeMode(val);
    } else {
      setHeightSizeMode(val);
    }
  }

  function handleChangingRowGap(val: number) {
    if (onChange) {
      doChange({
        ...value,
        rowGap: val
      });
    }
  }

  function handleChangingColumnGap(val: number) {
    if (onChange) {
      doChange({
        ...value,
        columnGap: val
      });
    }
  }

  function handleChangingRowPadding(val: number) {
    if (onChange) {
      doChange({
        ...value,
        paddingTop: val,
        paddingBottom: val
      });
    }
  }

  function handleChangingColumnPadding(val: number) {
    if (onChange) {
      doChange({
        ...value,
        paddingLeft: val,
        paddingRight: val
      });
    }
  }

  function showAlignmentPreview() {
    const { justifyContent } = value;
    return justifyContent !== 'space-between' && justifyContent !== 'space-around';
  }

  function renderLayout() {
    if (!config.layout) {
      return null;
    }

    const { direction } = value;

    const iconClass = classNames({
      [styles.r90]: true,
      [styles.icon]: true
    });

    const options = [
      {
        value: 'fill',
        label: (
          <div className={styles.option}>
            <Grow />
            <span>Fill·撑满容器宽度</span>
          </div>
        ),
        tag: (
          <span>
            <Grow />
            Fill
          </span>
        )
      },
      {
        value: 'fixed',
        label: (
          <div className={styles.option}>
            <Fixed />
            <span>Fixed·固定宽度</span>
          </div>
        ),
        tag: (
          <span>
            <Fixed />
            Fixed
          </span>
        )
      },
      {
        value: 'hug',
        label: (
          <div className={styles.option}>
            <Compact />
            <span>Hug·紧凑内容</span>
          </div>
        ),
        tag: (
          <span>
            <Compact />
            Hug
          </span>
        )
      }
    ];

    return (
      <div className={styles.p12}>
        <div className={styles.titleWrapper}>
          <p className={styles.title}>布局</p>
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            {config.layout.width ? (
              <NumberInput
                disabled={widthSizeMode !== 'fixed'}
                value={value.width as number}
                icon={<Width className={styles.numberIcon} />}
                onChange={data => handleChangeSize(data, 'width')}
              />
            ) : null}
            {config.layout.height ? (
              <NumberInput
                disabled={heightSizeMode !== 'fixed'}
                value={value.height as number}
                icon={<Height />}
                onChange={data => handleChangeSize(data, 'height')}
              />
            ) : null}
          </div>
          <div className={styles.sizeSelector}>
            {config.layout.widthGrow ? (
              <Select
                bordered={false}
                value={widthSizeMode}
                optionLabelProp="tag"
                popupMatchSelectWidth={false}
                onSelect={(val: string) => handleSelectingSizeMode(val as SizeMode, 'width')}
                options={options}
              />
            ) : null}
            {config.layout.heightGrow ? (
              <Select
                bordered={false}
                value={heightSizeMode}
                optionLabelProp="tag"
                popupMatchSelectWidth={false}
                onSelect={(val: string) => handleSelectingSizeMode(val as SizeMode, 'height')}
                options={options}
              />
            ) : null}
          </div>
          <div className={styles.row} style={{ height: 'auto' }}>
            {config.layout.direction ? (
              <>
                <div className={styles.left}>
                  <div className={styles.row}>
                    {renderDirectionSwitch()}
                    <Divider type="vertical" style={{ height: 8, borderRadius: 0.5, margin: 0 }} />
                    {renderWrapSwitch()}
                  </div>
                  {renderItemsAlignment()}
                </div>
                <div className={styles.right}>
                  {showAlignmentPreview()
                    ? renderAlignmentPreview(direction as 'row' | 'column')
                    : renderSpaceAssignmentPreview(direction as 'row' | 'column')}
                </div>
              </>
            ) : null}
          </div>
          {config.layout.gap ? (
            <div className={styles.row}>
              <NumberInput
                icon={<Gap className={styles.icon} />}
                value={value.columnGap as number}
                onChange={handleChangingColumnGap}
              />
              <NumberInput
                icon={<Gap className={iconClass} />}
                value={value.rowGap as number}
                onChange={handleChangingRowGap}
              />
            </div>
          ) : null}
          {config.layout.padding ? (
            <div className={styles.row}>
              <NumberInput
                icon={<Padding className={iconClass} value={value.paddingLeft} />}
                onChange={handleChangingColumnPadding}
              />
              <NumberInput
                icon={<Padding className={styles.icon} value={value.paddingTop} />}
                onChange={handleChangingRowPadding}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  function handleSwitchDirection(direction: any) {
    if (onChange) {
      doChange({
        ...value,
        direction
      });
    }
  }

  function handleSwitchWrap(val: any) {
    if (onChange) {
      doChange({
        ...value,
        flexWrap: val
      });
    }
  }

  function renderDirectionSwitch() {
    const { direction } = value;
    const rowSelectedClass = classNames({
      [styles.iconSelected]: (direction as string) === 'row',
      [styles.icon]: true
    });
    const columnSelectedClass = classNames({
      [styles.iconSelected]: (direction as string) === 'column',
      [styles.icon]: true,
      [styles.r90]: true
    });
    return (
      <div className={styles.directionContainer}>
        <Arrow className={rowSelectedClass} onClick={() => handleSwitchDirection('row')} />
        <Arrow className={columnSelectedClass} onClick={() => handleSwitchDirection('column')} />
      </div>
    );
  }

  function renderWrapSwitch() {
    const { flexWrap } = value;
    const wrapClass = classNames({
      [styles.iconSelected]: (flexWrap as string) === 'wrap',
      [styles.icon]: true,
      [styles.f20]: true
    });

    const noWrapClass = classNames({
      [styles.iconSelected]: flexWrap === 'nowrap',
      [styles.icon]: true,
      [styles.f20]: true
    });
    return (
      <div className={styles.wrapContainer}>
        <Wrap className={wrapClass} onClick={() => handleSwitchWrap('wrap')} />
        <NoWrap className={noWrapClass} onClick={() => handleSwitchWrap('nowrap')} />
      </div>
    );
  }

  function handleClickingFillExpandingBtn() {
    // TODO: 初始化填充值
    setFillVisible(true);
  }

  function handleClickingFillCollapseBtn() {
    // TODO: 删除当前填充值
    setFillVisible(false);
  }

  function renderFill() {
    if (!config.backgroundColor) {
      return null;
    }

    return (
      <div className={styles.p12}>
        <div className={styles.titleWrapper}>
          <p className={styles.title}>填充</p>
          {fillVisible ? null : <PlusThin className={styles.icon} onClick={handleClickingFillExpandingBtn} />}
        </div>
        {fillVisible ? (
          <div className={styles.fillContainer}>
            <Popover
              open={fillOpen}
              trigger={['click']}
              content={renderColorPalette(colors, handleSelectingFillColor)}
              placement="leftTop"
              arrow={false}
              onOpenChange={(newOpen: boolean) => setFillOpen(newOpen)}
            >
              <div className={styles.colorResult}>
                <div
                  className={styles.color}
                  style={{ height: 20, width: 20, backgroundColor: fillColorObj?.value || 'transparent' }}
                />
                <p className={styles.colorTitle}>{fillColorObj?.name || '请选择'}</p>
              </div>
            </Popover>
            <Line className={styles.deleteIcon} onClick={handleClickingFillCollapseBtn} />
          </div>
        ) : null}
        <div className={styles.bodySingle}></div>
      </div>
    );
  }

  function handleClickingBorderExpandingBtn() {
    setBorderVisible(true);
  }

  function handleClickingBorderCollapseBtn() {
    setBorderVisible(false);
  }

  function handleSelectingBorderType(borderType: string) {
    setBorderType(borderType);
  }

  function handleSelectingBorderStyle(val: string) {
    delete value.borderStyle;
    delete value.borderTopStyle;
    delete value.borderRightStyle;
    delete value.borderBottomStyle;
    delete value.borderLeftStyle;

    if (onChange) {
      doChange({
        ...value,
        [`${borderType}Style`]: val
      });
    }
  }

  function handleChangingBorderWidth(val: number) {
    if (!borderType) {
      return;
    }
    delete value.borderWidth;
    delete value.borderTopWidth;
    delete value.borderRightWidth;
    delete value.borderBottomWidth;
    delete value.borderLeftWidth;

    if (onChange) {
      doChange({
        ...value,
        [`${borderType}Width`]: val
      });
    }
  }

  function renderBorder() {
    if (!config.border) {
      return null;
    }

    return (
      <div className={styles.p12}>
        <div className={styles.row}>
          <div className={styles.titleWrapper}>
            <p className={styles.title}>线框</p>
            {borderVisible ? null : <PlusThin className={styles.icon} onClick={handleClickingBorderExpandingBtn} />}
          </div>
        </div>
        {borderVisible ? (
          <div className={styles.borderContainer}>
            <div>
              <Popover
                open={borderOpen}
                trigger={['click']}
                content={renderColorPalette(borderOpt, handleSelectingBorderColor)}
                placement="leftTop"
                arrow={false}
                onOpenChange={(newOpen: boolean) => setBorderOpen(newOpen)}
              >
                <div className={styles.colorResult}>
                  <div
                    className={styles.color}
                    style={{ height: 20, width: 20, backgroundColor: borderColorObj?.value || 'transparent' }}
                  />
                  <p className={styles.colorTitle}>{borderColorObj?.name || '请选择'}</p>
                </div>
              </Popover>
              <div className={styles.borderBar}>
                <Border2
                  className={classNames({ [styles.icon]: true, [styles.iconSelected]: borderType === 'border' })}
                  onClick={() => handleSelectingBorderType('border')}
                />
                <SingleBorder
                  className={classNames({ [styles.icon]: true, [styles.iconSelected]: borderType === 'borderLeft' })}
                  onClick={() => handleSelectingBorderType('borderLeft')}
                />
                <SingleBorder
                  className={classNames({
                    [styles.r90]: true,
                    [styles.icon]: true,
                    [styles.iconSelected]: borderType === 'borderTop'
                  })}
                  onClick={() => handleSelectingBorderType('borderTop')}
                />
                <SingleBorder
                  className={classNames({
                    [styles.r180]: true,
                    [styles.icon]: true,
                    [styles.iconSelected]: borderType === 'borderRight'
                  })}
                  onClick={() => handleSelectingBorderType('borderRight')}
                />
                <SingleBorder
                  className={classNames({
                    [styles.r270]: true,
                    [styles.icon]: true,
                    [styles.iconSelected]: borderType === 'borderBottom'
                  })}
                  onClick={() => handleSelectingBorderType('borderBottom')}
                />
              </div>
              <div className={styles.row}>
                <NumberInput icon={<Thickness />} value={borderWidth as number} onChange={handleChangingBorderWidth} />
                <div className={styles.lineContainer}>
                  <Line
                    className={classNames({
                      [styles.icon]: true,
                      [styles.iconSelected]: borderStyle === 'solid'
                    })}
                    onClick={() => handleSelectingBorderStyle('solid')}
                  />
                  <DashedLine
                    className={classNames({
                      [styles.icon]: true,
                      [styles.iconSelected]: borderStyle === 'dashed'
                    })}
                    onClick={() => handleSelectingBorderStyle('dashed')}
                  />
                </div>
              </div>
            </div>
            <Line className={styles.deleteIcon} onClick={handleClickingBorderCollapseBtn} />
          </div>
        ) : null}
      </div>
    );
  }

  function handleClickingShadowExpandingBtn() {
    // TODO: 初始化阴影值
    setShadowVisible(true);
  }

  function handleClickingShadowCollapsingBtn() {
    // TODO: 初始化阴影值
    setShadowVisible(false);
  }

  function renderShadow() {
    if (!config.shadow) {
      return null;
    }

    const shadowOptTpl = <div>阴影选项占位符</div>;

    return (
      <div className={styles.p12}>
        <div className={styles.titleWrapper}>
          <p className={styles.title}>阴影</p>
          {shadowVisible ? null : <PlusThin className={styles.icon} onClick={handleClickingShadowExpandingBtn} />}
        </div>
        {shadowVisible ? (
          <div className={styles.shadowContainer}>
            <Popover
              open={shadowOpen}
              trigger={['click']}
              content={shadowOptTpl}
              placement="leftTop"
              arrow={false}
              onOpenChange={(newOpen: boolean) => setShadowOpen(newOpen)}
            >
              <div>占位符</div>
            </Popover>
            <Line className={styles.deleteIcon} onClick={handleClickingShadowCollapsingBtn} />
          </div>
        ) : null}
      </div>
    );
  }

  function handleSelectingTextAlignment(val: 'left' | 'right' | 'center' | 'justify') {
    const newValue = value ? { ...value } : {};
    if (val === 'left') {
      delete newValue.textAlign;
    } else {
      newValue.textAlign = val;
    }
    if (onChange) {
      doChange(newValue);
    }
  }

  function handleSwitchBold() {
    const newValue = value ? { ...value } : {};
    if (newValue.fontWeight >= 600) {
      delete newValue?.fontWeight;
    } else {
      newValue.fontWeight = 600;
    }
    if (onChange) {
      doChange(newValue);
    }
  }

  function handleSwitchItalic() {
    const newValue = value ? { ...value } : {};

    const { fontStyle } = newValue;
    if (fontStyle) {
      delete newValue.fontStyle;
    } else {
      newValue.fontStyle = 'italic';
    }
    if (onChange) {
      doChange(newValue);
    }
  }

  function handleToggleTextDecoration(val: 'line-through' | 'underline') {
    const newValue = value ? { ...value } : {};
    const { textDecoration } = newValue;
    if (textDecoration) {
      if ((textDecoration as string).indexOf(val) > -1) {
        (textDecoration as string).replace(val, '');
      } else {
        const arr = (textDecoration as string).split(' ').filter(item => !!item);
        arr.push(val);
        newValue.textDecoration = arr.join(' ');
      }
    } else {
      newValue.textDecoration = val;
    }
  }

  function renderText() {
    if (!config.text) {
      return null;
    }

    return (
      <div className={styles.p12}>
        <div className={styles.titleWrapper}>
          <p className={styles.title}>文字</p>
        </div>
        <div className={styles.body}>
          <Popover
            open={textOpen}
            trigger={['click']}
            content={renderTextPalette()}
            placement="leftTop"
            arrow={false}
            onOpenChange={(newOpen: boolean) => setTextOpen(newOpen)}
          >
            <div className={styles.textSizeResult}>
              <p
                className={styles.text}
                style={{ fontSize: textSizeObj?.fontSize || 12, lineHeight: textSizeObj?.lineHeight || '20px' }}
              >
                Ag
              </p>
              <p className={styles.colorTitle}>{textSizeObj?.name || '请选择'}</p>
            </div>
          </Popover>
          <Popover
            open={textColorOpen}
            trigger={['click']}
            content={renderColorPalette(textColorOptions, handleSelectingTextColor)}
            placement="leftTop"
            arrow={false}
            onOpenChange={(newOpen: boolean) => setTextColorOpen(newOpen)}
          >
            <div className={styles.colorResult}>
              <div
                className={styles.color}
                style={{ height: 20, width: 20, backgroundColor: textColorObj?.value || 'transparent' }}
              />
              <p className={styles.colorTitle}>{textColorObj?.name || '请选择'}</p>
            </div>
          </Popover>
          <div className={styles.textBtnBar}>
            <TextAlignLeft
              className={classNames({ [styles.icon]: true, [styles.selected]: value?.textAlign === 'left' })}
              onClick={() => handleSelectingTextAlignment('left')}
            />
            <TextAlignCenter
              className={classNames({ [styles.icon]: true, [styles.selected]: value?.textAlign === 'center' })}
              onClick={() => handleSelectingTextAlignment('center')}
            />
            <TextAlignRight
              className={classNames({ [styles.icon]: true, [styles.selected]: value?.textAlign === 'right' })}
              onClick={() => handleSelectingTextAlignment('right')}
            />
            <TextAlignJustify
              className={classNames({ [styles.icon]: true, [styles.selected]: value?.textAlign === 'justify' })}
              onClick={() => handleSelectingTextAlignment('justify')}
            />
            <Divider style={{ height: 8, borderRadius: 0.5, margin: 0 }} type="vertical" />
            <Bold
              className={classNames({ [styles.icon]: true, [styles.selected]: value?.fontWeight >= 600 })}
              onClick={handleSwitchBold}
            />
            <Italic
              className={classNames({ [styles.icon]: true, [styles.selected]: value?.fontStyle === 'italic' })}
              onClick={handleSwitchItalic}
            />
            <LineThrough
              className={classNames({
                [styles.icon]: true,
                [styles.selected]: ((value?.textDecoration || '') as string).indexOf('line-through') > -1
              })}
              onClick={() => handleToggleTextDecoration('line-through')}
            />
            <UnderLine
              className={classNames({
                [styles.icon]: true,
                [styles.selected]: ((value?.textDecoration || '') as string).indexOf('underline') > -1
              })}
              onClick={() => handleToggleTextDecoration('underline')}
            />
          </div>
        </div>
      </div>
    );
  }

  function handleSelectingFillColor(val: { name: string; value: string }) {
    setFillColorObj(val);
    if (onChange) {
      doChange({
        ...value,
        backgroundColor: val.value
      });
    }
    setFillOpen(false);
  }

  function handleSelectingBorderColor(val: { name: string; value: string }) {
    setBorderColorObj(val);
    if (onChange) {
      doChange({
        ...value,
        borderColor: val.value
      });
    }
    setBorderOpen(false);
  }

  function handleSelectingShadow(val: { name: string; value: string }) {
    setShadowObj(val);
  }

  function handleSelectingTextColor(val: { name: string; value: string }) {
    setTextColorObj(val);
    if (onChange) {
      doChange({
        ...value,
        color: val.value
      });
    }
    setTextColorOpen(false);
  }

  function renderColorPalette(
    colors: {
      category: string;
      data: {
        name: string;
        value: string;
      }[];
    }[],
    cb: (data: any) => void
  ) {
    return (
      <div className={styles.colorPalette}>
        {colors.map(group => {
          return (
            <div key={group.category} className={styles.categoryContainer}>
              <p className={styles.categoryTitle}>{group.category}</p>
              <div className={styles.colorContainer}>
                {group.data.map(item => {
                  return (
                    <Tooltip key={item.name} title={item.name}>
                      <div className={styles.color} style={{ backgroundColor: item.value }} onClick={() => cb(item)} />
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function handleSelectingTextSize(size: { fontSize: number; lineHeight: string; name: string }) {
    setTextSizeObj(size);
    const { fontSize, lineHeight } = size;
    if (onChange) {
      doChange({
        ...value,
        fontSize,
        lineHeight
      });
    }
    setTextOpen(false);
  }

  function renderTextPalette() {
    return (
      <>
        {textSizeOptions.map(item => {
          return (
            <p key={item.name} className={styles.textStyle} onClick={() => handleSelectingTextSize(item)}>
              <span className={styles.textPreview} style={{ fontSize: item.fontSize, lineHeight: item.lineHeight }}>
                Ag
              </span>
              <span className={styles.textName}>{item.name}</span>
            </p>
          );
        })}
      </>
    );
  }

  return (
    <div>
      {renderLayout()}
      {renderFill()}
      {renderBorder()}
      {renderShadow()}
      {renderText()}
    </div>
  );
}
