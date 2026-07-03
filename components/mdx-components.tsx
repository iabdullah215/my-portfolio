"use client"

// Client boundary: the components map below includes interactive components
// (PreBlock, ImageZoom); evaluating the MDX body inside a server component
// would try to dot into those client-module proxies and crash. As a client
// component this still server-renders to HTML for SEO.
//
// NOTE: we deliberately do NOT import from "next-contentlayer/hooks" — its
// index re-exports useLiveReload, which imports pages-router / dev-overlay
// modules that break app-router SSR. This is the same tiny implementation.
import React from "react"
import ReactDOM from "react-dom"
import * as jsxDevRuntime from "react/jsx-dev-runtime"
import * as jsxRuntime from "react/jsx-runtime"
import Image, { type ImageProps } from "next/image"
import type { ImgHTMLAttributes } from "react"
import { PreBlock } from "@/components/pre-block"
import { ImageZoom } from "@/components/image-zoom"

// Merged so the evaluated body works whether contentlayer compiled it with
// the production runtime (jsx/jsxs) or the dev runtime (jsxDEV).
const _jsx_runtime = { ...jsxDevRuntime, ...jsxRuntime }

function getMDXComponent(code: string) {
  const scope = { React, ReactDOM, _jsx_runtime }
  const fn = new Function(...Object.keys(scope), code)
  return fn(...Object.values(scope)).default
}

function MdxImage(props: ImageProps) {
  return (
    <ImageZoom src={String(props.src)} alt={props.alt}>
      <Image
        {...props}
        alt={props.alt ?? ""}
        loading={props.loading ?? "lazy"}
        sizes={props.sizes ?? "(min-width: 1280px) 1280px, 92vw"}
        className={["rounded-lg", props.className].filter(Boolean).join(" ")}
      />
    </ImageZoom>
  )
}

// Markdown ![alt](src) images — plain <img>, zoomable
function MdxImg({ src = "", alt, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <ImageZoom src={src} alt={alt}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt ?? ""} loading="lazy" {...rest} />
    </ImageZoom>
  )
}

const components = {
  Image: MdxImage,
  img: MdxImg,
  // Adds a copy-to-clipboard button to every fenced code block
  pre: PreBlock,
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const Component = React.useMemo(() => getMDXComponent(code), [code])

  return <Component components={components} />
}
