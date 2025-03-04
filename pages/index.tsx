import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import * as Yup from 'yup'
import { IconDatabase } from '@tabler/icons'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import {
  Anchor,
  Container,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Alert,
  Center
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { Layout } from '../components/Layout'
import { AuthForm } from '../types'
import Image from 'next/image'

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('No email provided'),
  password: Yup.string()
    .required('No password provided')
    .min(5, 'Password should be min 5 chars'),
})

const Home: NextPage = () => {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          email: form.values.email,
          password: form.values.password,
        })
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: form.values.email,
        password: form.values.password,
      })
      form.reset()
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.response.data.message)
    }
  }

  return (
    <Layout title="Auth">
      <Container size={400} className="flex flex-col items-center mt-16">
        {/* <Center> */}
        <div className="flex justify-center">
          <Image src="/ShieldCheckIcon.svg" alt="ShieldCheckIcon" width={40} height={40} unoptimized />
        {/* </Center> */}
        </div>

        {error && (
          <Alert
            my="md"
            variant="filled"
            icon={<ExclamationCircleIcon className="w-5 h-5 text-white" />}
            title="Authorization Error"
            color="red"
            radius="md"
          >
            {error}
          </Alert>
        )}
        
        <form onSubmit={form.onSubmit(handleSubmit)} className="w-full max-w-xs space-y-4 p-6 bg-white rounded-lg shadow-md">
          <TextInput
            id="email"
            label="Email*"
            placeholder="example@gmail.com"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            id="password"
            placeholder="password"
            label="Password*"
            description="Must be min 5 char"
            {...form.getInputProps('password')}
          />
          <Group mt="md" position="apart">
            <Anchor
              component="button"
              type="button"
              size = "xs"
              className="text-sm text-gray-500 hover:underline"
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
            >
              {isRegister
                ? 'Have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button
              leftIcon={<IconDatabase size={20} />}
              color="cyan"
              type="submit"
            >
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </Group>
        </form>
      </Container>
    </Layout>
  )
}

export default Home
