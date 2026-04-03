import DownloadIconRed from '@/components/icons/course-management/DownloadIconRed'
import PlayIcon from '@/components/icons/course-management/PlayIcon'
import VideoIcon from '@/components/icons/course-management/VideoIcon'
import PdfIcon from '@/components/icons/student-management/PdfIcon'
import Image from 'next/image'
import React from 'react'

const getGradeColors = (grade: string) => {
  switch(grade) {
    case 'A':
      return { bg: 'bg-[#2a3d2e]', text: 'text-[#18CC3F]' }
    case 'A+':
      return { bg: 'bg-[#2a3d2e]', text: 'text-[#18CC3F]' }
    case 'A-':
      return { bg: 'bg-[#4CAF50]', text: 'text-[#030C15]' }
    case 'B+':
      return { bg: 'bg-[#2a3a4a]', text: 'text-[#1B91FF]' }
    case 'B':
      return { bg: 'bg-[#2a3a4a]', text: 'text-[#1B91FF]' }
    case 'F':
      return { bg: 'bg-[#4c2828]', text: 'text-[#E9201D]' }
    default:
      return { bg: 'bg-[#2a3d2e]', text: 'text-[#18CC3F]' }
  }
}

export default function AssignmentSubmissionCard({ submission }: { submission: any }) {
    console.log(submission)
    const gradeColors = getGradeColors(submission.grade)
  return (
    <div className=' p-4 rounded-[12px] bg-[#0a1d2e] border-l border-[#5F6CA0] space-y-8'>
        {/* items 1 */}
        <div className=' flex justify-between items-start'>
          <div className=' flex items-center gap-3'>
            <Image src={submission.avatar} alt="Avatar"  />
            <div>
                <h3 className=' text-base text-white font-medium'>{submission.user_name}</h3>
                <p className=' text-sm text-[#D2D2D5] mt-1'>{submission.user_id}</p>
            </div>
          </div>

          <div className=' flex items-center gap-2'>
           <p className={`text-sm ${gradeColors.text} font-medium py-1 px-2.5 rounded-full ${gradeColors.bg} inline-block`}>{submission.grade} Grade</p>
           <p className=' text-sm text-[#9747FF] font-medium py-1 px-2.5 rounded-full bg-[#4f3570] inline-block'>{submission.marks }  </p>
          </div>
        </div>

        {/* item-2 */}
        <div>
            <div className=' flex items-center justify-between'>
                <p className=' text-base text-white'> <span className=' text-[#8D9CDC]'>Submitted: </span>{submission.submission_date} | {submission.submission_time}</p>
                <p className=' text-base text-white'> <span className=' text-[#8D9CDC]'>Graded by:   </span> {submission.teacher_name}</p>

            </div>

            <div className={`grid grid-cols-1 ${submission.submission_files.length > 1 ? 'lg:grid-cols-2' : ''} gap-3 mt-3`}>
                {
                submission.submission_files.map((file: string, index: number) => {
                  const isMp4File = file.toLowerCase().endsWith('.mp4')

                  return (
                <div key={index} className=' border border-[#303650] rounded-[10px] flex items-center justify-between'>
                            <div className=' flex items-center gap-2.5'>
                                <div className=' px-4 py-5 bg-[#303650] rounded-l-[10px]'>
                      {isMp4File ? <VideoIcon /> : <PdfIcon />}
                                </div>

                    <p className=' text-sm text-[#A5A5AB] mt-2.5'>{file}</p>
                            </div>
                         
                    {isMp4File ? <PlayIcon className=' mr-3' /> : <DownloadIconRed className=' mr-3'/>}

                        </div>
                  )
                })
                }
            </div>
                 
        </div>

        {/* item-3 */}
        <div className=' px-4 py-3 bg-[#0a1929] rounded-[12px]  border border-[#3D4566] border-dashed'>
            <h3 className=' text-base text-white font-medium'>Feedback</h3>
            <p className=' mt-1 text-sm text-[#D2D2D5]'>
                {submission.feedback}
            </p>

        </div>
    </div>
  )
}
