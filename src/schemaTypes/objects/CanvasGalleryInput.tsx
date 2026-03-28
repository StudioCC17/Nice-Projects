/**
 * CanvasGalleryInput
 *
 * Custom input component for the `gallerySlide` object type.
 * Replaces the default array UI with a visual canvas where
 * editors can drag and resize images into position.
 *
 * Step 2: Resize handles + controls panel
 * - Drag to reposition images on the canvas
 * - Resize handle on bottom-right corner to adjust width
 * - Controls panel for fine-tuning x, y, width, zIndex via sliders
 * - Default Sanity fields collapsed into a toggleable section
 *
 * @see https://www.sanity.io/docs/studio/form-components
 */
import {useCallback, useMemo, useRef, useState} from 'react'
import {Box, Button, Card, Flex, Grid, Stack, Text} from '@sanity/ui'
import {EyeOpenIcon, EyeClosedIcon} from '@sanity/icons'
import {
  type ObjectInputProps,
  set,
  useClient,
} from 'sanity'
import imageUrlBuilder from '@sanity/image-url'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface PositionedImage {
  _key: string
  _type: 'positionedImage'
  image?: {
    asset?: {
      _ref: string
      _type: 'reference'
    }
  }
  alt?: string
  x: number
  y: number
  width: number
  zIndex: number
}

interface GallerySlideValue {
  _type: 'gallerySlide'
  images?: PositionedImage[]
}

// ─────────────────────────────────────────────────────────────
// Slider Control
// ─────────────────────────────────────────────────────────────

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (value: number) => void
}

function SliderControl({label, value, min, max, step, suffix = '%', onChange}: SliderControlProps) {
  return (
    <Box>
      <Flex justify="space-between" style={{marginBottom: 4}}>
        <Text size={0} muted>
          {label}
        </Text>
        <Text size={0} weight="medium">
          {Math.round(value * 10) / 10}
          {suffix}
        </Text>
      </Flex>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          accentColor: '#2276fc',
          height: 4,
          cursor: 'pointer',
        }}
      />
    </Box>
  )
}

// ─────────────────────────────────────────────────────────────
// Draggable Image (with resize handle)
// ─────────────────────────────────────────────────────────────

interface DraggableImageProps {
  image: PositionedImage
  imageUrl: string | null
  isSelected: boolean
  onSelect: (key: string) => void
  onPositionChange: (key: string, x: number, y: number) => void
  onWidthChange: (key: string, width: number) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

function DraggableImage({
  image,
  imageUrl,
  isSelected,
  onSelect,
  onPositionChange,
  onWidthChange,
  containerRef,
}: DraggableImageProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const dragStart = useRef({x: 0, y: 0, imgX: 0, imgY: 0})
  const resizeStart = useRef({mouseX: 0, startWidth: 0})

  // ── Drag handler ──
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onSelect(image._key)

      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        imgX: image.x ?? 10,
        imgY: image.y ?? 10,
      }
      setIsDragging(true)

      const handleMove = (moveEvent: PointerEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const dx = ((moveEvent.clientX - dragStart.current.x) / rect.width) * 100
        const dy = ((moveEvent.clientY - dragStart.current.y) / rect.height) * 100
        const newX = Math.max(0, Math.min(90, dragStart.current.imgX + dx))
        const newY = Math.max(0, Math.min(90, dragStart.current.imgY + dy))
        onPositionChange(image._key, newX, newY)
      }

      const handleUp = () => {
        setIsDragging(false)
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [image._key, image.x, image.y, onSelect, onPositionChange, containerRef],
  )

  // ── Resize handler ──
  const handleResizeDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      resizeStart.current = {mouseX: e.clientX, startWidth: image.width ?? 40}

      const handleMove = (moveEvent: PointerEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const dx = ((moveEvent.clientX - resizeStart.current.mouseX) / rect.width) * 100
        const newWidth = Math.max(10, Math.min(90, resizeStart.current.startWidth + dx))
        onWidthChange(image._key, newWidth)
      }

      const handleUp = () => {
        setIsResizing(false)
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [image._key, image.width, onWidthChange, containerRef],
  )

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        position: 'absolute',
        left: `${image.x ?? 10}%`,
        top: `${image.y ?? 10}%`,
        width: `${image.width ?? 40}%`,
        zIndex: image.zIndex ?? 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        outline: isSelected ? '2px solid #2276fc' : 'none',
        outlineOffset: '3px',
        borderRadius: '2px',
        transition: isDragging || isResizing ? 'none' : 'outline 0.15s ease',
        userSelect: 'none',
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={image.alt ?? ''}
          draggable={false}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none',
            borderRadius: '2px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}
        />
      ) : (
        <Card
          padding={4}
          tone="transparent"
          style={{
            width: '100%',
            aspectRatio: '4/3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Text size={1} muted>
            No image
          </Text>
        </Card>
      )}

      {/* Resize handle — only visible when selected */}
      {isSelected && (
        <div
          onPointerDown={handleResizeDown}
          style={{
            position: 'absolute',
            right: -5,
            bottom: -5,
            width: 12,
            height: 12,
            background: '#2276fc',
            borderRadius: '2px',
            cursor: 'se-resize',
            border: '2px solid #fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Controls Panel (for selected image)
// ─────────────────────────────────────────────────────────────

interface ControlsPanelProps {
  image: PositionedImage
  imageIndex: number
  onChange: (path: (string | number)[], value: number) => void
}

function ControlsPanel({image, imageIndex, onChange}: ControlsPanelProps) {
  return (
    <Card padding={3} radius={2} border tone="default">
      <Stack space={4}>
        <Text size={1} weight="semibold">
          Position & Scale
        </Text>
        <Grid columns={2} gap={4}>
          <SliderControl
            label="X Position"
            value={image.x ?? 10}
            min={0}
            max={90}
            step={0.5}
            onChange={(v) => onChange(['images', imageIndex, 'x'], v)}
          />
          <SliderControl
            label="Y Position"
            value={image.y ?? 10}
            min={0}
            max={90}
            step={0.5}
            onChange={(v) => onChange(['images', imageIndex, 'y'], v)}
          />
          <SliderControl
            label="Width"
            value={image.width ?? 40}
            min={10}
            max={90}
            step={0.5}
            onChange={(v) => onChange(['images', imageIndex, 'width'], v)}
          />
          <SliderControl
            label="Layer"
            value={image.zIndex ?? 1}
            min={0}
            max={10}
            step={1}
            suffix=""
            onChange={(v) => onChange(['images', imageIndex, 'zIndex'], v)}
          />
        </Grid>
      </Stack>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
// Canvas Gallery Input (main component)
// ─────────────────────────────────────────────────────────────

export function CanvasGalleryInput(props: ObjectInputProps<GallerySlideValue>) {
  const {value, onChange, renderDefault} = props
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [showRawFields, setShowRawFields] = useState(false)

  // Set up image URL builder (memoised to avoid rebuilding on every render)
  const client = useClient({apiVersion: '2024-01-01'})
  const builder = useMemo(() => imageUrlBuilder(client), [client])

  const images = value?.images ?? []

  // Find selected image and its index
  const selectedImage = selectedKey ? images.find((img) => img._key === selectedKey) : null
  const selectedIndex = selectedKey ? images.findIndex((img) => img._key === selectedKey) : -1

  // Get a display URL for a positioned image
  const getImageUrl = useCallback(
    (img: PositionedImage): string | null => {
      if (!img.image?.asset?._ref) return null
      return builder.image(img.image.asset._ref).width(800).auto('format').url()
    },
    [builder],
  )

  // Handle drag position changes
  const handlePositionChange = useCallback(
    (key: string, x: number, y: number) => {
      const imageIndex = images.findIndex((img) => img._key === key)
      if (imageIndex === -1) return

      const roundedX = Math.round(x * 10) / 10
      const roundedY = Math.round(y * 10) / 10

      onChange(set(roundedX, ['images', imageIndex, 'x']))
      onChange(set(roundedY, ['images', imageIndex, 'y']))
    },
    [images, onChange],
  )

  // Handle resize width changes
  const handleWidthChange = useCallback(
    (key: string, width: number) => {
      const imageIndex = images.findIndex((img) => img._key === key)
      if (imageIndex === -1) return

      const roundedWidth = Math.round(width * 10) / 10
      onChange(set(roundedWidth, ['images', imageIndex, 'width']))
    },
    [images, onChange],
  )

  // Handle slider changes from the controls panel
  const handleSliderChange = useCallback(
    (path: (string | number)[], value: number) => {
      const rounded = Math.round(value * 10) / 10
      onChange(set(rounded, path))
    },
    [onChange],
  )

  // Deselect when clicking canvas background
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === containerRef.current) {
        setSelectedKey(null)
      }
    },
    [],
  )

  return (
    <Stack space={4}>
      {/* Canvas area */}
      <Card border radius={2} overflow="hidden">
        <div
          ref={containerRef}
          onClick={handleCanvasClick}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 10',
            background: '#f3f0ec',
            cursor: 'default',
          }}
        >
          {images.length === 0 && (
            <Flex
              align="center"
              justify="center"
              style={{position: 'absolute', inset: 0}}
            >
              <Text size={1} muted>
                Add images using the controls below, then drag to position them.
              </Text>
            </Flex>
          )}
          {images.map((img) => (
            <DraggableImage
              key={img._key}
              image={img}
              imageUrl={getImageUrl(img)}
              isSelected={selectedKey === img._key}
              onSelect={setSelectedKey}
              onPositionChange={handlePositionChange}
              onWidthChange={handleWidthChange}
              containerRef={containerRef}
            />
          ))}
        </div>
      </Card>

      {/* Controls panel for selected image */}
      {selectedImage && selectedIndex !== -1 && (
        <ControlsPanel
          image={selectedImage}
          imageIndex={selectedIndex}
          onChange={handleSliderChange}
        />
      )}

      {/* Image count */}
      <Flex align="center" justify="space-between">
        <Text size={1} muted>
          {images.length}/3 images
        </Text>
        {selectedKey && (
          <Text size={0} muted>
            Click canvas background to deselect
          </Text>
        )}
      </Flex>

      {/* Collapsible raw Sanity fields for adding/removing images */}
      <Card radius={2} border overflow="hidden">
        <Button
          mode="bleed"
          tone="default"
          onClick={() => setShowRawFields(!showRawFields)}
          style={{width: '100%'}}
          padding={3}
        >
          <Flex align="center" justify="space-between">
            <Text size={1} muted>
              {showRawFields ? 'Hide' : 'Show'} image management
            </Text>
            {showRawFields ? (
              <EyeClosedIcon style={{color: '#8b8b8b'}} />
            ) : (
              <EyeOpenIcon style={{color: '#8b8b8b'}} />
            )}
          </Flex>
        </Button>
        {showRawFields && (
          <Box padding={3}>
            {renderDefault(props)}
          </Box>
        )}
      </Card>
    </Stack>
  )
}
