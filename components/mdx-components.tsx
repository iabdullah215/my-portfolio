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
import type { ImgHTMLAttributes, TableHTMLAttributes } from "react"
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

// Alt text like "image" or "first" is a placeholder, not a caption.
const PLACEHOLDER_ALT = /^(image|img|screenshot|picture|photo|pic|figure|fig|untitled|first|second|third|flag|[\w.-]+\.(png|jpe?g|gif|webp|svg))$/i

function captionFor(alt?: string) {
  const text = alt?.trim() ?? ""
  return text.split(/\s+/).length >= 3 && !PLACEHOLDER_ALT.test(text)
    ? text
    : null
}

/**
 * Bordered figure frame. Built from block <span>s, not <figure>, because
 * markdown images render inside a <p>. Captioned figures are lettered
 * FIG A, FIG B… by a CSS counter (see .post-figure in globals.css).
 */
function Figure({ alt, children }: { alt?: string; children: React.ReactNode }) {
  const caption = captionFor(alt)
  return (
    <span className="post-figure not-prose">
      <span className="post-figure-media">{children}</span>
      {caption && (
        <span className="post-figure-caption">
          <span className="post-figure-label" aria-hidden />
          <span>{caption}</span>
        </span>
      )}
    </span>
  )
}

function MdxImage(props: ImageProps) {
  return (
    <Figure alt={props.alt}>
      <ImageZoom src={String(props.src)} alt={props.alt}>
        <Image
          {...props}
          alt={props.alt ?? ""}
          loading={props.loading ?? "lazy"}
          sizes={props.sizes ?? "(min-width: 1024px) 736px, 92vw"}
          className={["rounded-lg", props.className].filter(Boolean).join(" ")}
        />
      </ImageZoom>
    </Figure>
  )
}

// Markdown ![alt](src) images — plain <img>, zoomable
function MdxImg({ src = "", alt, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <Figure alt={alt}>
      <ImageZoom src={src} alt={alt}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ""} loading="lazy" {...rest} />
      </ImageZoom>
    </Figure>
  )
}

function MdxTable(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-scroll">
      <table {...props} />
    </div>
  )
}

const components = {
  Image: MdxImage,
  img: MdxImg,
  table: MdxTable,
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
