/**
 * Button - 通用按钮组件
 *
 * 为什么要封装？
 * - 项目中多处需要按钮（提交、删除、翻牌、评分...）
 * - 统一样式和交互行为，避免每个地方重复写 className
 * - 通过 variant 属性切换不同风格
 *
 * 知识点：
 * - props.children: 按钮内部的内容（文字、图标等）
 * - props.variant: 通过字符串控制样式变体
 * - 解构赋值 + 剩余参数 (...rest): 透传原生 button 属性
 */
export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}) {
  // 不同 variant 对应的 Tailwind 样式
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    warning: 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500',
  }

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
