import { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import axios from 'axios';
import Logo from '../../assets/logo.svg';
import apiRoutes from '../../utils/ApiRoutes';


const { loginRoute } = apiRoutes


interface LoginAttributes {
  emailOrUsername: string;
  password: string;
}

const toastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark"
}

const Login = () => {
  const [formData, setFormData] = useState<LoginAttributes>({
    emailOrUsername: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  },[navigate]);

  const handleValidation = (): boolean => {
    const { emailOrUsername, password } = formData;
    if (password === "") {
      toast.error(
        "username/email and Password is required",
        toastOptions
      );
      return false;
    } else if (emailOrUsername === "") {
      toast.error(
        "username/email and Password is required",
        toastOptions
      );
      return false;
    }
    return true;
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (handleValidation()) {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const body = {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password
      }
      try {
        const { data } = await axios.post(`${loginRoute}`, body, config);
        if (data.success) {
          console.log(data);
          localStorage.setItem("chat-app-user", JSON.stringify(data.data));
          if (data.data.isAvatarImageSet) {
            navigate("/");
            console.log('image is set')
          } else {
            navigate("/set/avatar");
            console.log('image not set')
          }
        } else {
          toast.error(data.message, toastOptions);
        }
      } catch (error) {
        toast.error("invalid credentials", toastOptions);
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(current => {
      return {...current, [e.target.name]: e.target.value}
    });
  }

  const { emailOrUsername, password } = formData;
  

  return (
    <>
    <FormContainer>
      <form onSubmit={e => handleSubmit(e)}>
        <div className='brand'>
          <img src={Logo} alt='logo' />
          <h1>Snappy</h1>
        </div>
        <input
         type="text" 
         name='emailOrUsername' 
         value={emailOrUsername}
         min={3}
         placeholder='Username/Email' 
         onChange={e => handleChange(e)} 
         />
         <input
         type="password" 
         name='password' 
         value={password}
         placeholder='Password' 
         onChange={e => handleChange(e)} 
         />

         <button type='submit'>Login</button>
         <span>Don't have an account ? <Link to={`/register`}>Register</Link></span>
      </form>
    </FormContainer>
    <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  border: 1rem solid #red;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    transition: 0.5s ease-in-out
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;