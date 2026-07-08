import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from '@react-email/components';

interface VerifyEmailProps {
  url: string;
}

export default function VerifyEmail({ url }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email</Preview>

      <Body
        style={{
          backgroundColor: '#FBFBFB',
          margin: 0,
          padding: '40px 0',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Container style={{ textAlign: 'center' }}>
          
          <Container
            style={{
              width: '100%',
              maxWidth: '420px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingLeft: '10px',
              paddingRight: '10px',
            }}
          >
            <Heading
              style={{
                fontSize: '28px',
                margin: '0 0 16px 0',
                color: '#18181b',
              }}
            >
              Verify your account
            </Heading>

            <Text
              style={{
                fontSize: '16px',
                margin: '0 0 24px 0',
                color: '#444',
              }}
            >
              Click the button below to verify your email.
            </Text>

            <Button
              href={url}
              style={{
                backgroundColor: '#18181B',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '90px',
                display: 'inline-block',
              }}
            >
              Verify Email
            </Button>
          </Container>
        </Container>
      </Body>
    </Html>
  );
}