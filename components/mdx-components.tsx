import Image, { type ImageProps } from "next/image"
import { useMDXComponent } from "next-contentlayer/hooks"

function MdxImage(props: ImageProps) {
  return (
    <Image
      {...props}
      loading={props.loading ?? "lazy"}
      sizes={props.sizes ?? "(min-width: 768px) 768px, 100vw"}
      className={["rounded-lg", props.className].filter(Boolean).join(" ")}
    />
  )
}

const components = {
  Image: MdxImage,
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code)

  return <Component components={components} />
}
