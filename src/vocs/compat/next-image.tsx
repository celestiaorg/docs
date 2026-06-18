import type { CSSProperties, ImgHTMLAttributes } from 'react'

type StaticImageData = {
  height?: number
  src: string
  width?: number
}

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'height' | 'src' | 'width'> & {
  alt: string
  blurDataURL?: string
  fill?: boolean
  height?: number | `${number}`
  placeholder?: 'blur' | 'empty' | `data:image/${string}`
  priority?: boolean
  quality?: number | `${number}`
  src: string | StaticImageData
  width?: number | `${number}`
}

function resolveSrc(src: ImageProps['src']) {
  return typeof src === 'string' ? src : src.src
}

export default function Image({
  blurDataURL: _blurDataURL,
  fill,
  placeholder: _placeholder,
  priority: _priority,
  quality: _quality,
  src,
  style,
  ...props
}: ImageProps) {
  const fillStyle: CSSProperties | undefined = fill
    ? {
        height: '100%',
        inset: 0,
        objectFit: style?.objectFit ?? 'cover',
        position: 'absolute',
        width: '100%',
      }
    : undefined

  return <img src={resolveSrc(src)} style={{ ...style, ...fillStyle }} {...props} />
}
