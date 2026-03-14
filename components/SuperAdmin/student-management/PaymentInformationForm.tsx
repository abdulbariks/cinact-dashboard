"use client"

import React from 'react'

type PaymentInformationData = {
  transactionId: string
  paymentDate: string
  paymentAmount: string
}

type PaymentInformationErrors = Partial<Record<keyof PaymentInformationData, string>>

type PaymentInformationFormProps = {
  formData: PaymentInformationData
  errors: PaymentInformationErrors
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  inputClassName: string
  labelClassName: string
}

export default function PaymentInformationForm({
  formData,
  errors,
  handleInputChange,
  inputClassName,
  labelClassName,
}: PaymentInformationFormProps) {
  return (
    <div className='mt-6 flex flex-col gap-4'>
      <div>
        <label htmlFor='transactionId' className={labelClassName}>
          Transaction ID
        </label>
        <input
          id='transactionId'
          name='transactionId'
          value={formData.transactionId}
          onChange={handleInputChange}
          placeholder='Enter transaction ID'
          className={inputClassName}
        />
        {errors.transactionId && <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.transactionId}</p>}
      </div>

      <div>
        <label htmlFor='paymentDate' className={labelClassName}>
          Payment Date
        </label>
        <input
          id='paymentDate'
          type='date'
          name='paymentDate'
          value={formData.paymentDate}
          onChange={handleInputChange}
          className={inputClassName}
        />
        {errors.paymentDate && <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.paymentDate}</p>}
      </div>

      <div>
        <label htmlFor='paymentAmount' className={labelClassName}>
          Payment Amount
        </label>
        <input
          id='paymentAmount'
          name='paymentAmount'
          value={formData.paymentAmount}
          onChange={handleInputChange}
          placeholder='Enter payment amount'
          className={inputClassName}
        />
        {errors.paymentAmount && <p className='mt-1 text-xs text-[#ff7a7a]'>{errors.paymentAmount}</p>}
      </div>
    </div>
  )
}
