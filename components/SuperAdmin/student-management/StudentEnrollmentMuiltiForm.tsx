"use client"
import React, { useState } from 'react'

import BreadCrumpRightArrow from '@/components/icons/SuperAdmindashboard/BreadCrumpRightArrow'
import ContractDocumentForm from '@/components/SuperAdmin/student-management/ContractDocumentForm'
import PaymentInformationForm from '@/components/SuperAdmin/student-management/PaymentInformationForm'
import StudentInformationForm from '@/components/SuperAdmin/student-management/StudentInformationForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import Link from 'next/link'
import confirmImg from '@/public/admin-dashboard/confirm-img.png'
import BackIcon from '@/components/icons/others/BackIcon'
import Users2 from '@/components/icons/student-management/Users2'
import PaymentCard from '@/components/icons/student-management/PaymentCard'
import ContractDocumenticon from '@/components/icons/student-management/ContractDocumenticon'
import PdfIcon from '@/components/icons/student-management/PdfIcon'
import RedDownloadIcon from '@/components/icons/student-management/RedDownloadIcon'
import { UserService } from '@/service/user/user.service'
import { parseCookies } from 'nookies'
import { showErrorToast, showSuccessToast } from '@/lib/hotToast'

type FormData = {
  course: string
  studentName: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  experienceLevel: string
  actingGoalsInterests: string
  transactionId: string
  paymentDate: string
  paymentAmount: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const courseOptions = [
  'Acting Fundamentals',
  'Screen Acting',
  'Stage Performance',
  'Voice and Expression',
  'Improvisation',
]

const experienceOptions = ['Beginner', 'Intermediate', 'Advanced']

const initialFormData: FormData = {
  course: '',
  studentName: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  experienceLevel: '',
  actingGoalsInterests: '',
  transactionId: '',
  paymentDate: '',
  paymentAmount: '',
}

export default function StudentEnrollmentMuiltiForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [rulesAndRegulationFile, setRulesAndRegulationFile] = useState<File | null>(null)
  const [digitalContractFile, setDigitalContractFile] = useState<File | null>(null)
  const [activeDropZone, setActiveDropZone] = useState<'rules' | 'contract' | null>(null)
  const [fileErrors, setFileErrors] = useState<{ rulesAndRegulationFile?: string; digitalContractFile?: string }>({})
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step: number) => {
    const nextErrors: FormErrors = {}
    const nextFileErrors: { rulesAndRegulationFile?: string; digitalContractFile?: string } = {}

    if (step === 1) {
      if (!formData.course.trim()) nextErrors.course = 'Course is required'
      if (!formData.studentName.trim()) nextErrors.studentName = 'Student name is required'
      if (!formData.email.trim()) nextErrors.email = 'Email is required'
      if (!formData.phone.trim()) nextErrors.phone = 'Phone is required'
      if (!formData.address.trim()) nextErrors.address = 'Address is required'
      if (!formData.dateOfBirth.trim()) nextErrors.dateOfBirth = 'Date of birth is required'
      if (!formData.experienceLevel.trim()) nextErrors.experienceLevel = 'Experience level is required'
      if (!formData.actingGoalsInterests.trim()) nextErrors.actingGoalsInterests = 'Acting goals/interests is required'
    }

    if (step === 2) {
      if (!formData.transactionId.trim()) nextErrors.transactionId = 'Transaction ID is required'
      if (!formData.paymentDate.trim()) nextErrors.paymentDate = 'Payment date is required'
      if (!formData.paymentAmount.trim()) nextErrors.paymentAmount = 'Payment amount is required'
    }

    if (step === 3) {
      if (!rulesAndRegulationFile) nextFileErrors.rulesAndRegulationFile = 'Rules and regulation signing file is required'
      if (!digitalContractFile) nextFileErrors.digitalContractFile = 'Digital contract signing file is required'
    }

    setErrors(nextErrors)
    setFileErrors(nextFileErrors)
    return Object.keys(nextErrors).length === 0 && Object.keys(nextFileErrors).length === 0
  }

  const handleNext = () => {
    const isStepValid = validateStep(currentStep)
    if (!isStepValid) return
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const isStepValid = validateStep(3)
    if (!isStepValid) return

    if (!rulesAndRegulationFile || !digitalContractFile) return

    try {
      setIsSubmitting(true)
      const cookies = parseCookies()
      const token = cookies.token || cookies.accessToken || ''

      const response = await UserService.createManualEnrollment({
        token,
        courseId: formData.course,
        full_name: formData.studentName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.dateOfBirth,
        experience_level: formData.experienceLevel.toUpperCase(),
        acting_goals: formData.actingGoalsInterests,
        transaction_id: formData.transactionId,
        currncy: 'usd',
        amount: formData.paymentAmount,
        payment_date: formData.paymentDate,
        rules_signing: rulesAndRegulationFile,
        contract_signing: digitalContractFile,
      })

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || 'Failed to enroll student')
      }

      showSuccessToast(response?.data?.message || 'Student enrolled successfully')
      setIsSuccessDialogOpen(true)
      setFormData(initialFormData)
      setRulesAndRegulationFile(null)
      setDigitalContractFile(null)
      setErrors({})
      setFileErrors({})
      setCurrentStep(1)
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to enroll student'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileSelect = (field: 'rules' | 'contract', file: File | null) => {
    if (field === 'rules') {
      setRulesAndRegulationFile(file)
      if (fileErrors.rulesAndRegulationFile) {
        setFileErrors((prev) => ({ ...prev, rulesAndRegulationFile: undefined }))
      }
      return
    }

    setDigitalContractFile(file)
    if (fileErrors.digitalContractFile) {
      setFileErrors((prev) => ({ ...prev, digitalContractFile: undefined }))
    }
  }

  const handleDrop = (field: 'rules' | 'contract', e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setActiveDropZone(null)
    handleFileSelect(field, e.dataTransfer.files?.[0] ?? null)
  }

  const inputClassName =
    'w-full rounded-[16px] border border-[#3D4566]   p-4 text-white outline-none placeholder:text-[#3D4566] focus:border-[#8D9CDC]'

  const labelClassName = 'mb-2 block text-xs  text-[#B2B5B8]'

  return (
    <div>
      <div className='flex items-center gap-2'>
        <Link href='/dashboard/student-management' className='text-base text-[#5F6CA0] hover:text-[#8D9CDC]'>
          Student Management
        </Link>
        <BreadCrumpRightArrow />
        <p className='text-base font-medium text-[#8D9CDC]'>Manual Student Enrollment</p>
      </div>
      <div className='flex justify-center'>
        <div className='mt-6 w-174 rounded-2xl bg-[#0A1726] p-6'>
          <div className='flex items-center justify-between gap-4'>
            <h2 className='text-2xl font-semibold text-white'>Manual Student Enrollment</h2>
            {currentStep === 3 && (
              <button
                type='button'
                onClick={() => setIsPreviewDialogOpen(true)}
                className='rounded-xl bg-[#070707] border border-[#3D4566] px-3 py-2 text-base font-medium text-white transition-colors hover:bg-[#101c2d] cursor-pointer'
              >
                Preview Document
              </button>
            )}
          </div>
          <div className='mt-3 flex items-center  gap-3'>
            <p className='text-xl font-medium text-[#8D9CDC]'>
              {currentStep === 1 ? 'Student Information' : currentStep === 2 ? 'Payment Information' : 'Contract Document'}
            </p>
            <p className='text-base font-medium text-[#8D9CDC]'>({currentStep}/3)</p>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <StudentInformationForm
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleCourseChange={(value) => {
                  setFormData((prev) => ({ ...prev, course: value }))
                  if (errors.course) setErrors((prev) => ({ ...prev, course: '' }))
                }}
                handleExperienceLevelChange={(value) => {
                  setFormData((prev) => ({ ...prev, experienceLevel: value }))
                  if (errors.experienceLevel) setErrors((prev) => ({ ...prev, experienceLevel: '' }))
                }}
                inputClassName={inputClassName}
                labelClassName={labelClassName}
                courseOptions={courseOptions}
                experienceOptions={experienceOptions}
              />
            )}

            {currentStep === 2 && (
              <PaymentInformationForm
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                inputClassName={inputClassName}
                labelClassName={labelClassName}
              />
            )}

            {currentStep === 3 && (
              <ContractDocumentForm
                labelClassName={labelClassName}
                activeDropZone={activeDropZone}
                rulesAndRegulationFile={rulesAndRegulationFile}
                digitalContractFile={digitalContractFile}
                fileErrors={fileErrors}
                handleRulesDragOver={(e) => {
                  e.preventDefault()
                  setActiveDropZone('rules')
                }}
                handleContractDragOver={(e) => {
                  e.preventDefault()
                  setActiveDropZone('contract')
                }}
                handleRulesDragLeave={() => setActiveDropZone((prev) => (prev === 'rules' ? null : prev))}
                handleContractDragLeave={() => setActiveDropZone((prev) => (prev === 'contract' ? null : prev))}
                handleRulesDrop={(e) => handleDrop('rules', e)}
                handleContractDrop={(e) => handleDrop('contract', e)}
                handleRulesFileChange={(e) => handleFileSelect('rules', e.target.files?.[0] ?? null)}
                handleContractFileChange={(e) => handleFileSelect('contract', e.target.files?.[0] ?? null)}
              />
            )}

            <div className='mt-8 flex items-center justify-end gap-4'>
              <button
                type='button'
                onClick={handleBack}
                disabled={currentStep === 1}
                className='rounded-2xl bg-[#3d4566] px-10 py-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
              >
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  type='button'
                  onClick={handleNext}
                  className='rounded-2xl bg-[#E9201D] px-10 py-4 text-sm font-medium text-white hover:bg-[#e9201d]/90 cursor-pointer'
                >
                  Next  
                </button>
              ) : (
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='rounded-2xl bg-[#E9201D] px-10 py-4 text-sm font-medium text-white hover:bg-[#e9201d]/90 cursor-pointer'
                >
              {isSubmitting ? 'Enrolling...' : 'Enroll Student'}
                </button>
              )}
            </div>
          </form>

          <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
            <DialogContent className='fixed left-1/2 top-1/2 z-50 h-[90vh] max-h-[90vh] w-129.25 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border-none bg-[#0a1726] p-0 text-white flex flex-col'>
              <button
                type='button'
                aria-label='Close preview dialog'
                onClick={() => setIsPreviewDialogOpen(false)}
                className='absolute right-4 top-4 cursor-pointer text-[#B2B5B8] hover:text-white'
              >
                ✕
              </button>

              <DialogHeader className='border-b border-[#141B34] px-5 pb-4 pt-6'>
                <DialogTitle className='pr-8 text-xl font-semibold text-white'>Enrolment Complete</DialogTitle>
              </DialogHeader>

              <div className='flex-1 space-y-4 overflow-y-auto px-5 py-4'>
                <div className='rounded-[10px] bg-[#07121d] p-4'>
                  <div className='flex items-center gap-1'>
                    <Users2 />
                    <h2 className='text-lg font-medium text-white'>Student Information</h2>
                  </div>

                  <div className='mt-4 flex'>
                    <div className='flex-1 space-y-4'>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Full Name</p>
                        <p className='text-sm text-[#DFE1E7]'>Jane Cooper</p>
                      </div>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Phone</p>
                        <p className='text-sm text-[#DFE1E7]'>+32123 456 789</p>
                      </div>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Experience Level</p>
                        <p className='text-sm text-[#DFE1E7]'>1 Year</p>
                      </div>
                    </div>
                    <div className='flex-1 space-y-4'>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Email for Invoice</p>
                        <p className='text-sm text-[#DFE1E7]'>your@email.com</p>
                      </div>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Date of Birth</p>
                        <p className='text-sm text-[#DFE1E7]'>12/ 11 /2022</p>
                      </div>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Course</p>
                        <p className='text-sm text-[#DFE1E7]'>1 Year</p>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <p className='mb-1.5 text-xs text-[#585E66]'>Acting Goals / Interests</p>
                    <p className='text-sm text-[#DFE1E7]'>
                      Aspiring actor passionate about stage, screen, and voice performance. Currently training at CINACT to grow
                      my performance skills and creative confidence.
                    </p>
                  </div>
                </div>

                <div className='rounded-[10px] bg-[#07121d] p-4'>
                  <div className='flex items-center gap-1'>
                    <PaymentCard />
                    <h2 className='text-lg font-medium text-white'>Payment Information</h2>
                  </div>

                  <div className='mt-4 flex'>
                    <div className='flex-1 space-y-4'>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Payment Method:</p>
                        <p className='text-sm text-[#DFE1E7]'>Stripe</p>
                      </div>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Date</p>
                        <p className='text-sm text-[#DFE1E7]'>2025-08-19</p>
                      </div>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Status:</p>
                        <p className='text-sm text-[#DFE1E7]'>Paid</p>
                      </div>
                    </div>
                    <div className='flex-1 space-y-4'>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Transaction ID:</p>
                        <p className='text-sm text-[#DFE1E7]'>#TXN248529</p>
                      </div>
                      <div>
                        <p className='mb-1.5 text-xs text-[#585E66]'>Amount Paid:</p>
                        <p className='text-sm text-[#DFE1E7]'>$2,400</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='rounded-[10px] bg-[#07121d] p-4'>
                  <div className='flex items-center gap-1'>
                    <ContractDocumenticon />
                    <h2 className='text-lg font-medium text-white'>Contract Documents</h2>
                  </div>

                   <div className=' mt-4 space-y-4'>
                      <div className=' p-3 rounded-[10px] bg-[#101923] border-l border-[#5F6CA0] flex items-center justify-between'>
                        <div className=' flex items-center gap-2.5'>
                          <PdfIcon/>
                          <p className=' text-sm text-white '>Signed Contact</p>
                        </div>
                      <button className=' cursor-pointer'>

                        <RedDownloadIcon/>
                      </button>

                      </div>
                      <div className=' p-3 rounded-[10px] bg-[#101923] border-l border-[#5F6CA0] flex items-center justify-between'>
                        <div className=' flex items-center gap-2.5'>
                          <PdfIcon/>
                          <p className=' text-sm text-white '>Rules & Regulations</p>
                        </div>
                      <button className=' cursor-pointer'>

                        <RedDownloadIcon/>
                      </button>

                      </div>
                      
                   </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
            <DialogContent className='fixed left-1/2 top-1/2 z-50 w-125 -translate-x-1/2 -translate-y-1/2 rounded-4xl border-none bg-[#0A1726] p-8 text-white'>
              {/* <DialogHeader>
                <DialogTitle>Enrollment Successful</DialogTitle>
                <DialogDescription className='text-[#B6C2ED]'>
                  Student enrollment has been completed and saved successfully.
                </DialogDescription>
              </DialogHeader> */}
              <div className=' flex items-center justify-center'>
               <div>
               <div className=' flex items-center justify-center'>
              <Image src={confirmImg} alt="Confirm" />

               </div>
              <h2 className=' text-white text-xl font-semibold py-6 text-center'>Manual Enrollment Complete</h2>

              <Link href='/dashboard' className='flex items-center justify-center gap-2.5 text-base text-[#8D9CDC] font-medium cursor-pointer'>
                <BackIcon />
                Back to Home
              </Link>
               </div>
              </div>
              
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
