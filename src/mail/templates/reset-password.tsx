import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
} from '@react-email/components';

interface RecoveryPasswordProps {
  token: string;
}

export default function RecoveryPassword({ token }: RecoveryPasswordProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>

      <Body>
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
              Reset your password
            </Heading>

            <Text
              style={{
                fontSize: '16px',
                margin: '0 0 24px 0',
                color: '#444',
              }}
            >
              Copy the code below.
            </Text>

            <Text
              style={{
                fontSize: '20px',
                backgroundColor: '#18181B',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '90px',
                display: 'inline-block',
              }}
            >
              { token }
            </Text>
          </Container>
        </Container>
      </Body>
    </Html>
  );
}