import { FormEvent, ChangeEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import axios from 'axios';
import Logo from '../../assets/logo.svg';
import apiRoutes from '../../utils/ApiRoutes';


const { registerRoute } = apiRoutes


interface RegisterAttributes {
  username: string;
  email: string;
  password: string;
  confirmPassword: string
}

const toastOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark"
}

const Register = () => {
  const [formData, setFormData] = useState<RegisterAttributes>({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/")
    }
  },[navigate]);

  const handleValidation = (): boolean => {
    const { username, email, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
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
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }
      try {
        const { data } = await axios.post(`${registerRoute}`, body, config);
        if (data.success) {
          navigate("/login");
        } else {
          toast.error(data.message, toastOptions);
        }
      } catch (error) {
        toast.error("something went wrong, please try again", toastOptions);
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(current => {
      return {...current, [e.target.name]: e.target.value}
    });
  }

  const { username, email, password, confirmPassword } = formData;
  

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
         name='username' 
         value={username}
         placeholder='Username' 
         onChange={e => handleChange(e)} 
         />
         <input
         type="email" 
         name='email' 
         value={email}
         placeholder='Email' 
         onChange={e => handleChange(e)} 
         />
         <input
         type="password" 
         name='password' 
         value={password}
         placeholder='Password' 
         onChange={e => handleChange(e)} 
         />
         <input
         type="password" 
         name='confirmPassword' 
         value={confirmPassword}
         placeholder='Confirm Password' 
         onChange={e => handleChange(e)} 
         />

         <button type='submit'>Create User</button>
         <span>Already have an account ? <Link to={`/login`}>Login</Link></span>
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

export default Register;