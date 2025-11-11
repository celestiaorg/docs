import Image, { ImageProps } from 'next/image'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function BaseImage({ src, ...props }: ImageProps) {
  const imageSrc = typeof src === 'string' && src.startsWith('/') 
    ? `${basePath}${src}` 
    : src
  
  return <Image src={imageSrc} {...props} />
}

