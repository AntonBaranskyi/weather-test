import { render, screen } from '@testing-library/react'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  it('renders with default icon', () => {
    render(
      <EmptyState
        title="Немає даних"
        description="Спробуйте щось інше"
      />
    )

    expect(screen.getByText('🌤️')).toBeInTheDocument()
    expect(screen.getByText('Немає даних')).toBeInTheDocument()
    expect(screen.getByText('Спробуйте щось інше')).toBeInTheDocument()
  })

  it('renders with custom icon', () => {
    render(
      <EmptyState
        icon="🌧️"
        title="Дощ"
        description="Погода дощова"
      />
    )

    expect(screen.getByText('🌧️')).toBeInTheDocument()
    expect(screen.getByText('Дощ')).toBeInTheDocument()
    expect(screen.getByText('Погода дощова')).toBeInTheDocument()
  })

  it('renders title as h3 element', () => {
    render(
      <EmptyState
        title="Заголовок"
        description="Опис"
      />
    )

    const titleElement = screen.getByText('Заголовок')
    expect(titleElement.tagName).toBe('H3')
  })

  it('renders description as paragraph element', () => {
    render(
      <EmptyState
        title="Заголовок"
        description="Опис"
      />
    )

    const descriptionElement = screen.getByText('Опис')
    expect(descriptionElement.tagName).toBe('P')
  })

  it('renders with special characters', () => {
    render(
      <EmptyState
        icon="⚡"
        title="Помилка 404"
        description="Сторінку не знайдено 😢"
      />
    )

    expect(screen.getByText('⚡')).toBeInTheDocument()
    expect(screen.getByText('Помилка 404')).toBeInTheDocument()
    expect(screen.getByText('Сторінку не знайдено 😢')).toBeInTheDocument()
  })

  it('renders with empty strings', () => {
    render(
      <EmptyState
        icon=""
        title=""
        description=""
      />
    )

  
  })
})
