import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AuthEmailTemplateProps {
  confirmationUrl: string
  actionText: string
  greeting: string
  message: string
  userEmail: string
}

export const AuthEmailTemplate = ({
  confirmationUrl,
  actionText,
  greeting,
  message,
  userEmail,
}: AuthEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>{message}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Heading style={h1}>GitEdu</Heading>
        </Section>
        
        <Section style={heroContainer}>
          <Heading style={h2}>{greeting}!</Heading>
          <Text style={text}>{message}</Text>
        </Section>

        <Section style={buttonContainer}>
          <Button style={button} href={confirmationUrl}>
            {actionText}
          </Button>
        </Section>

        <Section style={linkContainer}>
          <Text style={linkText}>
            Կամ պատճենեք և տեղադրեք այս հղումը ձեր բրաուզերում:
          </Text>
          <Link href={confirmationUrl} style={link}>
            {confirmationUrl}
          </Link>
        </Section>

        <Section style={footerContainer}>
          <Text style={footerText}>
            Եթե այս էլ.փոստը չեք ուղարկել դուք, կարող եք անտեսել այն:
          </Text>
          <Text style={footerText}>
            Շնորհակալություն,<br/>
            GitEdu թիմ
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '5px',
  margin: '40px auto',
  padding: '20px',
  width: '465px',
}

const logoContainer = {
  textAlign: 'center' as const,
  margin: '0 0 30px 0',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
}

const heroContainer = {
  margin: '0 0 30px 0',
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
}

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 20px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 20px',
}

const linkContainer = {
  margin: '30px 0',
}

const linkText = {
  color: '#898989',
  fontSize: '14px',
  margin: '0 0 10px 0',
}

const link = {
  color: '#007ee6',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
}

const footerContainer = {
  borderTop: '1px solid #f0f0f0',
  paddingTop: '20px',
  margin: '30px 0 0 0',
}

const footerText = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 10px 0',
}