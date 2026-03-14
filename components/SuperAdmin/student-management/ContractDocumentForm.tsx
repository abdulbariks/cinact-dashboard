"use client"

import UploadIcon from '@/components/icons/SuperAdmindashboard/UploadIcon'
import React from 'react'

type FileErrors = {
  rulesAndRegulationFile?: string
  digitalContractFile?: string
}

type ContractDocumentFormProps = {
  labelClassName: string
  activeDropZone: 'rules' | 'contract' | null
  rulesAndRegulationFile: File | null
  digitalContractFile: File | null
  fileErrors: FileErrors
  handleRulesDragOver: (e: React.DragEvent<HTMLLabelElement>) => void
  handleContractDragOver: (e: React.DragEvent<HTMLLabelElement>) => void
  handleRulesDragLeave: () => void
  handleContractDragLeave: () => void
  handleRulesDrop: (e: React.DragEvent<HTMLLabelElement>) => void
  handleContractDrop: (e: React.DragEvent<HTMLLabelElement>) => void
  handleRulesFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleContractFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ContractDocumentForm({
  labelClassName,
  activeDropZone,
  rulesAndRegulationFile,
  digitalContractFile,
  fileErrors,
  handleRulesDragOver,
  handleContractDragOver,
  handleRulesDragLeave,
  handleContractDragLeave,
  handleRulesDrop,
  handleContractDrop,
  handleRulesFileChange,
  handleContractFileChange,
}: ContractDocumentFormProps) {
  return (
    <div className='mt-6 flex flex-col gap-4'>
      <div>
        <label htmlFor='rulesAndRegulationFile' className={labelClassName}>
          Rules and Regulation Signing
        </label>
        <label
          htmlFor='rulesAndRegulationFile'
          onDragOver={handleRulesDragOver}
          onDragLeave={handleRulesDragLeave}
          onDrop={handleRulesDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            activeDropZone === 'rules' ? 'border-[#8D9CDC] bg-[#101c2d]' : 'border-[#3D4566] bg-transparent'
          }`}
        >
          <input
            id='rulesAndRegulationFile'
            type='file'
            onChange={handleRulesFileChange}
            className='hidden'
          />
          <UploadIcon className='h-10 w-10 text-[#8D9CDC]' />
          <p className='mt-4 text-sm font-medium text-white'>Drag & drop file here</p>
          <p className='mt-2 text-xs text-[#B2B5B8]'>or click to browse</p>
          {rulesAndRegulationFile && <p className='mt-3 text-xs text-[#8D9CDC]'>{rulesAndRegulationFile.name}</p>}
        </label>
        {fileErrors.rulesAndRegulationFile && (
          <p className='mt-1 text-xs text-[#ff7a7a]'>{fileErrors.rulesAndRegulationFile}</p>
        )}
      </div>

      <div>
        <label htmlFor='digitalContractFile' className={labelClassName}>
          Digital Contract Signing
        </label>
        <label
          htmlFor='digitalContractFile'
          onDragOver={handleContractDragOver}
          onDragLeave={handleContractDragLeave}
          onDrop={handleContractDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            activeDropZone === 'contract' ? 'border-[#8D9CDC] bg-[#101c2d]' : 'border-[#3D4566] bg-transparent'
          }`}
        >
          <input
            id='digitalContractFile'
            type='file'
            onChange={handleContractFileChange}
            className='hidden'
          />
          <UploadIcon className='h-10 w-10 text-[#8D9CDC]' />
          <p className='mt-4 text-sm font-medium text-white'>Drag & drop file here</p>
          <p className='mt-2 text-xs text-[#B2B5B8]'>or click to browse</p>
          {digitalContractFile && <p className='mt-3 text-xs text-[#8D9CDC]'>{digitalContractFile.name}</p>}
        </label>
        {fileErrors.digitalContractFile && (
          <p className='mt-1 text-xs text-[#ff7a7a]'>{fileErrors.digitalContractFile}</p>
        )}
      </div>
    </div>
  )
}
