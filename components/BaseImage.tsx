import { withBasePath } from '../src/vocs/compat/base-path'
import type { ImgHTMLAttributes } from 'react'

type BaseImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  alt?: string
  src: string
}

export function BaseImage({ src, alt = '', ...props }: BaseImageProps) {
  return <img src={withBasePath(src)} alt={alt} {...props} />
}
