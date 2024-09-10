

import React, { useEffect, useState } from 'react'
import { Input } from './input'
import { Label } from './label'
import { Button } from './button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RemoveNotification, setLikeNotifications } from '@/redux/RealTImeNotificationSlice'

function SignUp() {
    const user = useSelector((state) => state.auth.user);
    const dispatch=useDispatch();
  
    const [input,setInput]=useState({
        username:'',
        email:'',
        password:''
    })
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    const changeEventHandler=(event)=>{
      setInput({...input,[event.target.name]:event.target.value})
    }

    const handlesubmit=async(event)=>{
        // dispatch(RemoveNotification([]))
        
        event.preventDefault()
        console.log(input);
        try{
            setLoading(true);
            const res=await axios.post('https://instaclone-az8q.onrender.com/api/v1/user/register',input,{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            })

            console.log(res);
            if(res.data.success){
                navigate('/login')
           
                toast.success(res.data.message);
                setInput({
                    username:'',
                    email:'',
                    password:''
                })

            }

        } catch(error){
            console.log(error)
            toast.error(error.response.data.message)

        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user){
            navigate('/')
        }
    },[])
  return (
    <div className='flex items-center justify-center w-screen h-screen'>
        <form onSubmit={handlesubmit} className='flex flex-col p-8 gap-5 shadow-lg'>
            <div className='my-4'>
                <h1 className='text-center font-bold text-xl'>LOGO</h1>
                <p className='text-sm text-center'>Signup to see photos and videos from you friends.</p>
            </div>
            <div>
                <Label className=" ">Username</Label>
                <Input type="text" name="username" value={input.username} onChange={changeEventHandler} className="focus-visible:ring-transparent my-2" />
            </div>

            <div>
                <Label className=" ">Email</Label>
                <Input type="email" name="email"  value={input.email} onChange={changeEventHandler}  className="focus-visible:ring-transparent my-2" />
            </div>


            <div>
                <Label className=" ">Password</Label>
                <Input type="password" name="password" value={input.password} onChange={changeEventHandler} className="focus-visible:ring-transparent my-2" />
            </div>

            {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}
            <span className='text-sm text-center'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
       
        </form>
    </div>
  )
}

export default SignUp