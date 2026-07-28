import type { ImgHTMLAttributes } from 'react'

type BaseImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  alt?: string
  src: string
}

export function BaseImage({ src, alt = '', ...props }: BaseImageProps) {
  return <img src={src} alt={alt} {...props} />
}
