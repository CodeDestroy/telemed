export interface AxiosError {
  response?: {
    data?: string
  }
}

export interface AxiosErrorExtended {
  response?: {
    data?: {
      error?: string
    }
  }
}