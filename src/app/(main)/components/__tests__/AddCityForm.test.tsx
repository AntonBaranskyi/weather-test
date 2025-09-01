import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddCityForm from '../AddCityForm'

describe('AddCityForm', () => {
  const mockOnAddCity = jest.fn()

  beforeEach(() => {
    mockOnAddCity.mockClear()
  })

  it('renders form elements correctly', () => {
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText('Додати нове місто')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Назва міста (наприклад: Київ, Львів, Одеса)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Додати' })).toBeInTheDocument()
  })

  it('handles input change correctly', async () => {
    const user = userEvent.setup()
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    const input = screen.getByPlaceholderText('Назва міста (наприклад: Київ, Львів, Одеса)')
    await user.type(input, 'Київ')

    expect(input).toHaveValue('Київ')
  })

  it('submits form with valid city name', async () => {
    const user = userEvent.setup()
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    const input = screen.getByPlaceholderText('Назва міста (наприклад: Київ, Львів, Одеса)')
    const submitButton = screen.getByRole('button', { name: 'Додати' })

    await user.type(input, 'Київ')
    await user.click(submitButton)

    expect(mockOnAddCity).toHaveBeenCalledWith('Київ')
  })

  it('does not submit form with empty city name', async () => {
    const user = userEvent.setup()
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    const submitButton = screen.getByRole('button', { name: 'Додати' })
    await user.click(submitButton)

    expect(mockOnAddCity).not.toHaveBeenCalled()
  })

  it('does not submit form with whitespace-only city name', async () => {
    const user = userEvent.setup()
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    const input = screen.getByPlaceholderText('Назва міста (наприклад: Київ, Львів, Одеса)')
    const submitButton = screen.getByRole('button', { name: 'Додати' })

    await user.type(input, '   ')
    await user.click(submitButton)

    expect(mockOnAddCity).not.toHaveBeenCalled()
  })

  it('clears input after successful submission', async () => {
    const user = userEvent.setup()
    mockOnAddCity.mockResolvedValue(undefined)

    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    const input = screen.getByPlaceholderText('Назва міста (наприклад: Київ, Львів, Одеса)')
    const submitButton = screen.getByRole('button', { name: 'Додати' })

    await user.type(input, 'Київ')
    await user.click(submitButton)

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('shows loading state correctly', () => {
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={true}
        error={null}
      />
    )

    const input = screen.getByPlaceholderText('Назва міста (наприклад: Київ, Львів, Одеса)')
    const submitButton = screen.getByRole('button', { name: 'Додавання...' })

    expect(input).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it('disables submit button when input is empty during loading', () => {
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={true}
        error={null}
      />
    )

    const submitButton = screen.getByRole('button', { name: 'Додавання...' })
    expect(submitButton).toBeDisabled()
  })

  it('disables submit button when input is empty', () => {
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    const submitButton = screen.getByRole('button', { name: 'Додати' })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when input has valid content', async () => {
    const user = userEvent.setup()
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    const input = screen.getByPlaceholderText('Назва міста (наприклад: Київ, Львів, Одеса)')
    const submitButton = screen.getByRole('button', { name: 'Додати' })

    await user.type(input, 'Київ')

    expect(submitButton).not.toBeDisabled()
  })

  it('displays error message when error is provided', () => {
    const errorMessage = 'Місто не знайдено'
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={errorMessage}
      />
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('does not display error message when error is null', () => {
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    expect(screen.queryByText('Місто не знайдено')).not.toBeInTheDocument()
  })

  it('handles form submission via Enter key', async () => {
    const user = userEvent.setup()
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={false}
        error={null}
      />
    )

    const input = screen.getByPlaceholderText('Назва міста (наприклад: Київ, Львів, Одеса)')
    
    await user.type(input, 'Київ')
    await user.keyboard('{Enter}')

    expect(mockOnAddCity).toHaveBeenCalledWith('Київ')
  })

  it('prevents form submission when loading', async () => {
    const user = userEvent.setup()
    render(
      <AddCityForm
        onAddCity={mockOnAddCity}
        isLoading={true}
        error={null}
      />
    )

    const input = screen.getByPlaceholderText('Назва міста (наприклад: Київ, Львів, Одеса)')
    
    await user.type(input, 'Київ')
    await user.keyboard('{Enter}')

    expect(mockOnAddCity).not.toHaveBeenCalled()
  })
})
