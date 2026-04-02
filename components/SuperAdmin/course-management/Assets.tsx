"use client"

import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import VideoIcon from '@/components/icons/course-management/VideoIcon'
import PdfIcon from '@/components/icons/student-management/PdfIcon'
import PdfIconWhite from '@/components/icons/course-management/PdfIconWhite'
import VideoIconSecondary from '@/components/icons/course-management/VideoIconSecondary'
import TrashIconRed from '@/components/icons/course-management/TrashIconRed'

export const assets = [
  {
    id: 'a-1',
    moduleNo: '1',
    title: 'Personal Development',
    details: 'Build confidence, awareness, and a strong acting foundation for the class.',
    videos: [
      'class-1.mp4', 'class-2.mp4', 'class-3.mp4', 'class-4.mp4', 'class-5.mp4'
    ],
    attachments: [
      'breath-control.pdf', 'vocal-projection.pdf', 'articulation-practice.pdf', 'movement-flow.pdf', 'listening-skills.pdf'
    ]


  },
  {
    id: 'a-2',
    moduleNo: '2',
    title: 'Script Analysis',
    details: 'Review the script structure, objectives, and character motivations.',
    videos: [
      'script-analysis-1.mp4',
      'script-analysis-2.mp4',
      'script-analysis-3.mp4',
    ],
    attachments: [
      'scene-breakdown.pdf',
      'character-notes.pdf',
      'objective-sheet.pdf',
    ],
  },
  {
    id: 'a-3',
    moduleNo: '3',
    title: 'Voice Training',
    details: 'Practice projection, articulation, and breath control exercises.',
    videos: [
      'voice-training-1.mp4',
      'voice-training-2.mp4',
      'voice-training-3.mp4',
    ],
    attachments: [
      'voice-exercises.pdf',
      'breathing-drills.pdf',
      'projection-guide.pdf',
    ],
  },
  {
    id: 'a-4',
    moduleNo: '4',
    title: 'Performance Review',
    details: 'Track rehearsal progress and prepare feedback for final presentation.',
    videos: [
      'performance-review-1.mp4',
      'performance-review-2.mp4',
      'performance-review-3.mp4',
    ],
    attachments: [
      'review-checklist.pdf',
      'feedback-form.pdf',
      'final-notes.pdf',
    ],
  }
]

export default function Assets() {
  const [openItem, setOpenItem] = useState<string>('asset-1')

  return (
    <div className=' p-4 bg-[#07121d] rounded-[12px]'>
      <h2 className='text-xl font-medium text-white mb-4'>All Assets</h2>

      <Accordion
        type='single'
        collapsible
        value={openItem}
        onValueChange={(v) => setOpenItem(v)}
        className='flex w-full flex-col gap-3'
      >
        {assets.map((asset) => (
          <AccordionItem
            key={asset.id}
            value={`asset-${asset.moduleNo}`}
            className='rounded-2xl border border-[#3D4566] [&_[data-slot=accordion-trigger]>svg]:hidden'
          >
            <AccordionTrigger className='flex cursor-pointer items-center justify-between rounded-2xl data-[state=open]:rounded-b-none  px-4 text-left text-white hover:no-underline data-[state=open]:bg-[#262b40] bg-[#262b40]'>
              <div className='flex flex-col gap-1'>
                <p className='text-sm text-[#8D9CDC]'>Module {asset.moduleNo}</p>
                <h3 className='text-base font-medium text-white'>{asset.title}</h3>
              </div>
            </AccordionTrigger>

            <AccordionContent className='px-4 text-[#A5A5AB] bg-[#081623] rounded-b-2xl'>
              <div className='   p-4   flex   gap-6'>
                  {/* videos */}
                <div className=' flex-1 '>
                  <div className=' border-b  border-[#3D4566]'>
                    <div className=' inline-flex items-center gap-2 border-b-2 border-[#E9201D] p-5'>
                      <VideoIcon />
                      <h3 className=' text-base text-white font-medium'>Videos</h3>
                    </div>

                  </div>
                
                  <div className=' mt-4 space-y-4'>

                    {
                      asset.videos.map((video, index) => (
                        <div key={index} className=' flex justify-between items-center border border-[#303650] rounded-[10px] bg-[#0a1d2e]'>
                          <div className=' flex items-center gap-2.5'>
                            <div className=' bg-[#303650] rounded-l-[10px] py-6 px-4'>
                              <VideoIconSecondary />
                            </div>
                            <div>
                              <h4>{video}</h4>
                            </div>
                          </div>
                          <div className=' pr-3'>
                            <TrashIconRed />
                          </div>
                        </div>
                      ))
                    }
                  </div>



                </div>
                {/* attachments */}
                <div className=' flex-1 '>
                  <div className=' border-b  border-[#3D4566]'>
                    <div className=' inline-flex items-center gap-2 border-b-2 border-[#E9201D] p-5'>
                      <PdfIconWhite />

                      <h3 className=' text-base text-white font-medium'>Attachments</h3>
                    </div>

                  </div>

                  <div className=' mt-4 space-y-4'>
                    {
                      asset.attachments.map((file, index) => (
                        <div key={index} className=' flex justify-between items-center border border-[#303650] rounded-[10px] bg-[#0a1d2e]'>
                          <div className=' flex items-center gap-2.5'>
                            <div className=' bg-[#303650] rounded-l-[10px] py-6 px-4'>
                              <PdfIcon />
                            </div>
                            <div>
                              <h4>{file}</h4>
                            </div>
                          </div>
                          <div className=' pr-3'>
                            <TrashIconRed />
                          </div>
                        </div>
                      ))
                    }
                  </div>

                </div>

              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
