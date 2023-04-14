/**
 * 美萌表单校验规则
 */
import { Rule } from 'rc-field-form/lib/interface'

const required: Rule[] = [{ required: true }]

const trim: Rule[] = [{ pattern: /(^[^\s].*[^\s]$)|(^[^\s]*[^\s]$)/g, message: '首尾不允许空格' }]

/** 手机号 */
const mobile: Rule[] = [{ pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]

/** 昵称 */
const nickname: Rule[] = [
  { pattern: /^[a-zA-Z\d\u4e00-\u9fa5]+$/, message: '不能输入特殊符号' },
  { min: 2, message: '最少2个字符' },
  { max: 50, message: '最多50个字符' }
]

/**
 * 固定电话
 * https://c.runoob.com/front-end/854/
 */
const fixedTelephone: Rule[] = [{ pattern: /^(\(\d{3,4}-)|(\d{3.4}-)?\d{7,8}$/, message: '请输入正确的固定电话' }]

/**
 * 手机号码，3-4位区号，7-8位直播号码，1－4位分机号
 * https://c.runoob.com/front-end/854/
 */
const mobileAndFixedTelephone: Rule[] = [
  {
    pattern: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
    message: '请输入正确的电话号码'
  }
]

/** 中文名称 */
const chineseName: Rule[] = [
  { pattern: /^[\u4e00-\u9fa5]$/, message: '请输入中文' },
  { min: 2, message: '最少输入2个中文' },
  { min: 10, message: '最多输入10个中文' }
]

/** 价格 */
const price: Rule[] = [{ max: 999999999.99, message: '最多可输入999999999.99' }]

/** 数量（整数） */
const quantity: Rule[] = [{ max: 100 }]

/** emoji */
const emoji: Rule[] = [
  {
    validator: (_, value) => {
      const reg = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
      if (!value || !reg.test(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error('请勿输入特殊字符'))
    }
  }
]

const mmFormRule = {
  /** 必填/必选 */
  required,
  /** 首尾不允许空格 */
  trim,
  /** 手机号 */
  mobile,
  /** 固定电话 */
  fixedTelephone,
  /** 手机号 + 固定电话 */
  mobileAndFixedTelephone,
  /** 中文名称 */
  chineseName,
  /** 价格 */
  price,
  /** 数量（整数） */
  quantity,
  /** emoji */
  emoji,
  /** 昵称 */
  nickname
}

export default mmFormRule

type TConcatRule = keyof typeof mmFormRule | Rule | undefined

/**
 * 合并规则
 *
 * 可以传递mmFormRule有效的key
 * 或者Rule对象
 * 传递为undefined会被过滤
 *
 * @exapmle concatRule({require: true}, 'trim'])
 * @export
 * @param {Rule[]} rules
 * @param {(keyof typeof mmFormRule)[]} ruleKeys
 * @return {*}
 */
export function concatRule(rules: TConcatRule[] = []) {
  return rules.reduce((result, item) => {
    if (!item) {
      return result
    }
    return result.concat(typeof item === 'string' ? mmFormRule[item] : item)
  }, [] as Rule[])
}
