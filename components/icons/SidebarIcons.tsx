import { SVGProps } from "react"

interface OverviewIconProps extends SVGProps<SVGSVGElement> {
  isActive?: boolean;  
}

export const OverviewIcon = ({ isActive = false, ...props }: OverviewIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <path 
        d="M7.20248 2.62141L5.7818 3.2781C3.59393 4.28941 2.5 4.79506 2.5 5.62508C2.5 6.45511 3.59393 6.96076 5.78181 7.97206L7.20248 8.62875C8.57933 9.26516 9.26783 9.58341 10 9.58341C10.7322 9.58341 11.4207 9.26516 12.7975 8.62875L14.2182 7.97206C16.4061 6.96076 17.5 6.45511 17.5 5.62508C17.5 4.79506 16.4061 4.28941 14.2182 3.2781L12.7975 2.62141C11.4207 1.98496 10.7322 1.66675 10 1.66675C9.26783 1.66675 8.57933 1.98496 7.20248 2.62141Z" 
        stroke={isActive ? "#FFFFFF" : "#8D9CDC"} 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M17.3233 9.2478C17.4411 9.41339 17.5 9.58605 17.5 9.77589C17.5 10.5941 16.4061 11.0926 14.2182 12.0895L12.7975 12.7368C11.4207 13.3641 10.7322 13.6779 10 13.6779C9.26783 13.6779 8.57933 13.3641 7.20248 12.7368L5.78181 12.0895C3.59393 11.0926 2.5 10.5941 2.5 9.77589C2.5 9.58605 2.55889 9.41339 2.67667 9.2478" 
        stroke={isActive ? "#FFFFFF" : "#8D9CDC"} 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M16.9806 13.5552C17.3268 13.831 17.5 14.1059 17.5 14.4314C17.5 15.2497 16.4061 15.7481 14.2182 16.745L12.7975 17.3923C11.4207 18.0198 10.7322 18.3334 10 18.3334C9.26783 18.3334 8.57933 18.0198 7.20248 17.3923L5.78181 16.745C3.59393 15.7481 2.5 15.2497 2.5 14.4314C2.5 14.1059 2.67315 13.831 3.01945 13.5552" 
        stroke={isActive ? "#FFFFFF" : "#8D9CDC"} 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}