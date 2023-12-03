import { FC } from 'react';
import {
  Affix,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Carousel,
  Cascader,
  Checkbox,
  Collapse,
  ColorPicker,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  FloatButton,
  Form,
  Input,
  InputNumber,
  List,
  Mentions,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Radio,
  Rate,
  Result,
  Select,
  Slider,
  Space,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Tooltip,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
  Upload
} from 'antd';
import { CodeSandboxOutlined } from '@ant-design/icons';
import IComponentConfig from '@/types/component-config';
import PageRoot from '@/components/page-root';
import Container from '@/components/container';
import { camelotComponentConfig } from '@/service/load-config/camelot';

const Search = Input.Search;

const antdComponentConfig: { [key: string]: IComponentConfig } = {
  pageRoot: {
    configName: 'pageRoot',
    callingName: 'Flex',
    category: '通用',
    isHidden: true,
    dependency: 'antd',
    component: PageRoot,
    title: '页面',
    icon: CodeSandboxOutlined,
    propsConfig: {
      vertical: {
        id: 'vertical',
        schemaType: 'props',
        name: 'vertical',
        title: '布局方向',
        category: 'style',
        value: true,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      wrap: {
        id: 'wrap',
        schemaType: 'props',
        name: 'wrap',
        title: '自动换行',
        category: 'style',
        value: true,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      justify: {
        id: 'justify',
        name: 'justify',
        title: '主轴对齐',
        schemaType: 'props',
        category: 'style',
        value: 'normal',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      align: {
        id: 'align',
        schemaType: 'props',
        name: 'align',
        title: '副轴对齐',
        category: 'style',
        value: 'normal',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      gap: {
        id: 'gap',
        schemaType: 'props',
        name: 'gap',
        title: '间距',
        category: 'style',
        value: 8,
        valueType: 'number',
        valueSource: 'editorInput'
      }
    }
  },
  HorizontalFlex: {
    configName: 'HorizontalFlex',
    callingName: 'Flex',
    dependency: 'antd',
    isContainer: true,
    category: '布局',
    title: '水平弹性布局',
    icon: CodeSandboxOutlined,
    component: Container,
    propsConfig: {
      vertical: {
        id: 'vertical',
        schemaType: 'props',
        name: 'vertical',
        title: '布局方向',
        category: 'style',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      wrap: {
        id: 'wrap',
        schemaType: 'props',
        title: '自动换行',
        name: 'wrap',
        category: 'style',
        value: true,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      justify: {
        id: 'justify',
        title: '主轴对齐',
        name: 'justify',
        schemaType: 'props',
        category: 'style',
        value: 'normal',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      align: {
        id: 'align',
        schemaType: 'props',
        title: '副轴对齐',
        name: 'align',
        category: 'style',
        value: 'start',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      gap: {
        id: 'gap',
        schemaType: 'props',
        name: 'gap',
        title: '间距',
        category: 'style',
        value: 8,
        valueType: 'number',
        valueSource: 'editorInput'
      }
    }
  },
  VerticalFlex: {
    configName: 'VerticalFlex',
    callingName: 'Flex',
    dependency: 'antd',
    isContainer: true,
    category: '布局',
    title: '垂直弹性布局',
    icon: CodeSandboxOutlined,
    component: Container,
    propsConfig: {
      vertical: {
        id: 'vertical',
        schemaType: 'props',
        name: 'vertical',
        title: '布局方向',
        category: 'style',
        value: true,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      wrap: {
        id: 'wrap',
        schemaType: 'props',
        title: '自动换行',
        name: 'wrap',
        category: 'style',
        value: true,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      justify: {
        id: 'justify',
        title: '主轴对齐',
        name: 'justify',
        schemaType: 'props',
        category: 'style',
        value: 'normal',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      align: {
        id: 'align',
        schemaType: 'props',
        title: '副轴对齐',
        name: 'align',
        category: 'style',
        value: 'normal',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      gap: {
        id: 'gap',
        schemaType: 'props',
        name: 'gap',
        title: '间距',
        category: 'style',
        value: 8,
        valueType: 'number',
        valueSource: 'editorInput'
      }
    }
  },
  Button: {
    configName: 'Button',
    dependency: 'antd',
    component: Button,
    category: '通用',
    title: '按钮',
    icon: CodeSandboxOutlined,
    propsConfig: {
      type: {
        id: 'type',
        schemaType: 'props',
        name: 'type',
        title: '类型',
        category: 'basic',
        value: 'primary',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      danger: {
        id: 'danger',
        schemaType: 'props',
        name: 'danger',
        title: '设置危险按钮',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      disabled: {
        id: 'disabled',
        schemaType: 'props',
        name: 'disabled',
        title: '禁用',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      href: {
        id: 'href',
        schemaType: 'props',
        name: 'href',
        title: '链接',
        category: 'basic',
        value: undefined,
        valueType: 'string',
        valueSource: 'editorInput'
      },
      target: {
        id: 'target',
        schemaType: 'props',
        name: 'target',
        title: '目标页',
        category: 'basic',
        value: '_blank',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      loading: {
        id: 'loading',
        schemaType: 'props',
        name: 'loading',
        title: '加载中',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      shape: {
        id: 'shape',
        schemaType: 'props',
        name: 'shape',
        title: '形状',
        category: 'basic',
        value: 'default',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      size: {
        id: 'size',
        schemaType: 'props',
        name: 'size',
        title: '尺寸',
        category: 'basic',
        value: 'middle',
        valueType: 'string',
        valueSource: 'editorInput'
      },
      style: {
        id: 'style',
        schemaType: 'props',
        name: 'style',
        title: '样式',
        category: 'style',
        value: {},
        valueType: 'object',
        valueSource: 'editorInput'
      },
      onClick: {
        id: 'onClick',
        schemaType: 'props',
        name: 'onClick',
        title: '点击',
        category: 'event',
        value: undefined,
        valueType: 'function',
        valueSource: 'handler'
      }
    },
    children: {
      name: 'children',
      value: '按钮',
      category: 'children'
    }
  },
  Text: {
    configName: 'Text',
    callingName: 'Typography.Text',
    dependency: 'antd',
    component: Typography.Text,
    category: '通用',
    title: '文字',
    icon: CodeSandboxOutlined,
    propsConfig: {
      style: {
        id: 'style',
        schemaType: 'props',
        name: 'style',
        title: '样式',
        category: 'style',
        value: {},
        valueType: 'object',
        valueSource: 'editorInput'
      },
      copyable: {
        id: 'copyable',
        schemaType: 'props',
        name: 'copyable',
        title: '可复制',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      delete: {
        id: 'delete',
        schemaType: 'props',
        name: 'delete',
        title: '删除线',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      disabled: {
        id: 'disabled',
        schemaType: 'props',
        name: 'disabled',
        title: '禁用',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      editable: {
        id: 'editable',
        name: 'editable',
        title: '可编辑',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      ellipsis: {
        id: 'ellipsis',
        name: 'ellipsis',
        title: '自动省略',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      mark: {
        id: 'mark',
        name: 'mark',
        title: '添加标记',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      strong: {
        id: 'strong',
        name: 'strong',
        title: '加粗',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      italic: {
        id: 'italic',
        name: 'italic',
        title: '斜体',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      underline: {
        id: 'underline',
        title: '下划线',
        name: 'underline',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      }
    },
    children: {
      name: 'children',
      value: '默认文字',
      category: 'children'
    }
  },
  Paragraph: {
    configName: 'Paragraph',
    callingName: 'Typography.Paragraph',
    dependency: 'antd',
    component: Typography.Paragraph,
    category: '通用',
    title: '段落',
    icon: CodeSandboxOutlined,
    propsConfig: {
      style: {
        id: 'style',
        schemaType: 'props',
        name: 'style',
        title: '样式',
        category: 'style',
        value: {},
        valueType: 'object',
        valueSource: 'editorInput'
      },
      copyable: {
        id: 'copyable',
        schemaType: 'props',
        name: 'copyable',
        title: '可复制',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      delete: {
        id: 'delete',
        schemaType: 'props',
        name: 'delete',
        title: '删除线',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      disabled: {
        id: 'disabled',
        schemaType: 'props',
        name: 'disabled',
        title: '禁用',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      editable: {
        id: 'editable',
        name: 'editable',
        title: '可编辑',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      ellipsis: {
        id: 'ellipsis',
        name: 'ellipsis',
        title: '自动省略',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      mark: {
        id: 'mark',
        name: 'mark',
        title: '添加标记',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      strong: {
        id: 'strong',
        name: 'strong',
        title: '加粗',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      italic: {
        id: 'italic',
        name: 'italic',
        title: '斜体',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      underline: {
        id: 'underline',
        title: '下划线',
        name: 'underline',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      }
    },
    children: {
      name: 'children',
      value: '默认段落',
      category: 'children'
    }
  },
  Title: {
    configName: 'Title',
    callingName: 'Typography.Title',
    dependency: 'antd',
    component: Typography.Title,
    category: '通用',
    title: '标题',
    icon: CodeSandboxOutlined,
    propsConfig: {
      style: {
        id: 'style',
        schemaType: 'props',
        name: 'style',
        title: '样式',
        category: 'style',
        value: {},
        valueType: 'object',
        valueSource: 'editorInput'
      },
      copyable: {
        id: 'copyable',
        schemaType: 'props',
        name: 'copyable',
        title: '可复制',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      delete: {
        id: 'delete',
        schemaType: 'props',
        name: 'delete',
        title: '删除线',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      disabled: {
        id: 'disabled',
        schemaType: 'props',
        name: 'disabled',
        title: '禁用',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      editable: {
        id: 'editable',
        name: 'editable',
        title: '可编辑',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      ellipsis: {
        id: 'ellipsis',
        name: 'ellipsis',
        title: '自动省略',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      mark: {
        id: 'mark',
        name: 'mark',
        title: '添加标记',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      strong: {
        id: 'strong',
        name: 'strong',
        title: '加粗',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      italic: {
        id: 'italic',
        name: 'italic',
        title: '斜体',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      },
      underline: {
        id: 'underline',
        title: '下划线',
        name: 'underline',
        schemaType: 'props',
        category: 'basic',
        value: false,
        valueType: 'boolean',
        valueSource: 'editorInput'
      }
    },
    children: {
      name: 'children',
      value: '默认标题',
      category: 'children'
    }
  },
  Divider: {
    configName: 'Divider',
    dependency: 'antd',
    component: Divider,
    category: '布局',
    title: '分割线',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Space: {
    configName: 'Space',
    dependency: 'antd',
    component: Space,
    category: '布局',
    title: '间距',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Anchor: {
    configName: 'Anchor',
    dependency: 'antd',
    component: Anchor,
    category: '导航',
    title: '锚点',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Breadcrumb: {
    configName: 'Breadcrumb',
    dependency: 'antd',
    component: Breadcrumb,
    category: '导航',
    title: '面包屑',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Dropdown: {
    configName: 'Dropdown',
    dependency: 'antd',
    component: Dropdown,
    category: '导航',
    title: '下拉菜单',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Menu: {
    configName: 'Menu',
    dependency: 'antd',
    component: Menu,
    category: '导航',
    title: '菜单导航',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Pagination: {
    configName: 'Pagination',
    dependency: 'antd',
    component: Pagination,
    category: '导航',
    title: '分页',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Steps: {
    configName: 'Steps',
    dependency: 'antd',
    component: Steps,
    category: '导航',
    title: '步骤条',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Cascader: {
    configName: 'Cascader',
    dependency: 'antd',
    component: Cascader,
    category: '数据录入',
    title: '级联选择',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Checkbox: {
    configName: 'Checkbox',
    dependency: 'antd',
    component: Checkbox,
    category: '数据录入',
    title: '多选框',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  ColorPicker: {
    configName: 'ColorPicker',
    dependency: 'antd',
    component: ColorPicker,
    category: '数据录入',
    title: '颜色选择器',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  DatePicker: {
    configName: 'DatePicker',
    dependency: 'antd',
    component: DatePicker as unknown as FC,
    category: '数据录入',
    title: '日期选择器',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Form: {
    configName: 'Form',
    component: Form,
    category: '数据录入',
    title: '表单',
    dependency: 'antd',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  'Input.Search': {
    configName: 'Input',
    callingName: 'Input.Search',
    dependency: 'antd',
    component: Search,
    category: '数据录入',
    title: '搜索框',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  'Input.TextArea': {
    configName: 'Input.TextArea',
    dependency: 'antd',
    component: Input.TextArea,
    category: '数据录入',
    title: '多行文本',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  InputNumber: {
    configName: 'InputNumber',
    dependency: 'antd',
    component: InputNumber,
    category: '数据录入',
    title: '数字输入框',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Mentions: {
    configName: 'Mentions',
    dependency: 'antd',
    component: Mentions,
    category: '数据录入',
    title: '提及',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Radio: {
    configName: 'Radio',
    dependency: 'antd',
    component: Radio,
    category: '数据录入',
    title: '单选框',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Rate: {
    configName: 'Rate',
    component: Rate,
    category: '数据录入',
    title: '评分',
    dependency: 'antd',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Select: {
    configName: 'Select',
    dependency: 'antd',
    component: Select,
    category: '数据录入',
    title: '选择器',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Slider: {
    configName: 'Slider',
    dependency: 'antd',
    component: Slider,
    category: '数据录入',
    title: '滑动输入条',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Switch: {
    configName: 'Switch',
    dependency: 'antd',
    component: Switch,
    category: '数据录入',
    title: '开关',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  TimePicker: {
    configName: 'TimePicker',
    dependency: 'antd',
    component: TimePicker,
    category: '数据录入',
    title: '时间选择器',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Transfer: {
    configName: 'Transfer',
    dependency: 'antd',
    component: Transfer,
    category: '数据录入',
    title: '穿梭框',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  TreeSelect: {
    configName: 'TreeSelect',
    dependency: 'antd',
    component: TreeSelect,
    category: '数据录入',
    title: '树选择',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Upload: {
    configName: 'Upload',
    dependency: 'antd',
    component: Upload,
    category: '数据录入',
    title: '上传',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Avatar: {
    configName: 'Avatar',
    dependency: 'antd',
    component: Avatar,
    category: '数据展示',
    title: '头像',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  // TODO:
  Badge: {
    configName: 'Badge',
    dependency: 'antd',
    component: Badge,
    category: '数据展示',
    title: '徽标数',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Calendar: {
    configName: 'Calendar',
    dependency: 'antd',
    component: Calendar,
    category: '数据展示',
    title: '日历',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Card: {
    configName: 'Card',
    component: Card,
    category: '数据展示',
    title: '卡片',
    dependency: 'antd',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Carousel: {
    configName: 'Carousel',
    dependency: 'antd',
    component: Carousel,
    category: '数据展示',
    title: '走马灯',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Collapse: {
    configName: 'Collapse',
    dependency: 'antd',
    component: Collapse,
    category: '数据展示',
    title: '折叠面板',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Descriptions: {
    configName: 'Descriptions',
    dependency: 'antd',
    component: Descriptions,
    category: '数据展示',
    title: '描述列表',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Empty: {
    configName: 'Empty',
    dependency: 'antd',
    component: Empty,
    category: '数据展示',
    title: '空状态',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Image: {
    configName: 'Image',
    dependency: 'antd',
    component: Image as unknown as FC,
    category: '数据展示',
    title: '图片',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  List: {
    configName: 'List',
    component: List,
    category: '数据展示',
    title: '列表',
    dependency: 'antd',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Popover: {
    configName: 'Popover',
    dependency: 'antd',
    component: Popover,
    category: '数据展示',
    title: '气泡卡片',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Statistic: {
    configName: 'Statistic',
    dependency: 'antd',
    component: Statistic,
    category: '数据展示',
    title: '统计数值',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Table: {
    configName: 'Table',
    dependency: 'antd',
    component: Table,
    category: '数据展示',
    title: '表格',
    icon: CodeSandboxOutlined,
    propsConfig: {
      columns: {
        id: 'columns',
        schemaType: 'props',
        name: 'columns',
        title: '列',
        category: 'basic',
        valueType: 'array',
        valueSource: 'editorInput',
        templateKeyPathsReg: [
          {
            path: '\\[\\d+\\]\\.render',
            type: 'function',
            repeatType: 'table',
            columnKey: 'dataIndex',
            repeatPropRef: 'dataSource',
            indexKey: 'key',
            itemIndexInArgs: 1
          }
        ],
        value: [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: {}
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age'
          },
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: {}
          }
        ]
      },
      dataSource: {
        id: 'dataSource',
        schemaType: 'props',
        name: 'dataSource',
        title: '数据源',
        category: 'basic',
        valueType: 'array',
        valueSource: 'editorInput',
        value: [
          {
            key: '1',
            firstName: 'John',
            lastName: 'Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer']
          },
          {
            key: '2',
            name: 'Jim',
            lastName: 'Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser']
          },
          {
            key: '3',
            name: 'Joe',
            lastName: 'Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool', 'teacher']
          }
        ]
      }
    }
  },
  Tabs: {
    configName: 'Tabs',
    dependency: 'antd',
    component: Tabs,
    category: '数据展示',
    title: '标签页',
    icon: CodeSandboxOutlined,
    propsConfig: {
      items: {
        id: 'items',
        schemaType: 'props',
        name: 'items',
        title: '数据项',
        valueSource: 'editorInput',
        valueType: 'object',
        templateKeyPathsReg: [
          {
            type: 'object',
            path: '\\[\\d+\\]\\.children'
          }
        ],
        value: [
          {
            key: '1',
            label: '新建标签页',
            children: {}
          }
        ],
        category: 'basic'
      },
      tabBarExtraContent: {
        id: 'tabBarExtraContent',
        schemaType: 'props',
        name: 'tabBarExtraContent',
        title: 'tabBarExtraContent',
        valueSource: 'editorInput',
        valueType: 'object',
        templateKeyPathsReg: [
          {
            type: 'object',
            path: ''
          }
        ],
        value: {},
        category: 'basic'
      }
    }
  },
  Tag: {
    configName: 'Tag',
    component: Tag,
    category: '数据展示',
    title: '标签',
    dependency: 'antd',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Tooltip: {
    configName: 'Tooltip',
    dependency: 'antd',
    component: Tooltip,
    category: '数据展示',
    title: '文字提示',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Tree: {
    configName: 'Tree',
    dependency: 'antd',
    component: Tree,
    category: '数据展示',
    title: '树形控件',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Alert: {
    configName: 'Alert',
    dependency: 'antd',
    component: Alert,
    category: '反馈',
    title: '警告提示',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Drawer: {
    configName: 'Drawer',
    dependency: 'antd',
    component: Drawer,
    isLayer: true,
    category: '反馈',
    title: '抽屉',
    icon: CodeSandboxOutlined,
    propsConfig: {
      open: {
        id: 'open',
        schemaType: 'props',
        name: 'open',
        title: '显示',
        value: true,
        valueType: 'boolean',
        valueSource: 'userInput',
        category: 'basic'
      }
    },
    children: {
      value: [],
      name: 'children',
      category: 'children'
    }
  },
  Modal: {
    configName: 'Modal',
    dependency: 'antd',
    component: Modal,
    category: '反馈',
    title: '模态框',
    isLayer: true,
    icon: CodeSandboxOutlined,
    propsConfig: {
      title: {
        id: 'title',
        schemaType: 'props',
        name: 'title',
        title: '标题',
        value: '新建弹窗',
        valueType: 'string',
        valueSource: 'editorInput',
        category: 'basic'
      },
      open: {
        id: 'open',
        schemaType: 'props',
        name: 'open',
        title: '打开窗口',
        value: true,
        valueType: 'boolean',
        valueSource: 'userInput',
        category: 'basic'
      }
    },
    children: {
      value: [],
      name: 'children',
      category: 'children'
    }
  },
  Notification: {
    configName: 'Notification',
    dependency: 'antd',
    component: Notification as unknown as FC,
    category: '反馈',
    title: '通知提醒框',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Popconfirm: {
    configName: 'Popconfirm',
    dependency: 'antd',
    component: Popconfirm as unknown as FC,
    category: '反馈',
    title: '气泡确认框',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Result: {
    configName: 'Result',
    dependency: 'antd',
    component: Result,
    category: '反馈',
    title: '结果',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  Affix: {
    configName: 'Affix',
    dependency: 'antd',
    component: Affix as unknown as FC,
    category: '其他',
    title: '固定',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  },
  FloatButton: {
    configName: 'FloatButton',
    dependency: 'antd',
    component: FloatButton as unknown as FC,
    category: '通用',
    title: '浮动按钮',
    icon: CodeSandboxOutlined,
    propsConfig: {}
  }
};

const htmlComponentConfig: { [key: string]: IComponentConfig } = {};

export default { antd: antdComponentConfig, html: htmlComponentConfig, camelot: camelotComponentConfig } as {
  [key: string]: { [key: string]: IComponentConfig };
};
