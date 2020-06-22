import { Icon, Link, Text } from 'blockchain-info-components'
import React from 'react'

import { BalanceIcon, Child, Header, Row, Wrapper } from '../components'
import { Props as OwnProps } from '../index'
import ConnectionStatus from './ConnectionStatus'

const Exchange: React.FC<Props> = props => {
  return (
    <Link
      href={props.domains.exchange}
      rel='noopener noreferrer'
      target='_blank'
    >
      <Wrapper className='link'>
        <BalanceIcon
          name='bolt-with-background'
          size='22px'
          color='teal400'
          style={{ marginRight: '20px' }}
        />
        <Child>
          <Header>
            <Text size='20px' color='teal400' weight={600}>
              Blockchain Exchange
            </Text>
            <Icon name='external-link' color='grey400' role='button' />
          </Header>
          <Row>
            <ConnectionStatus />
          </Row>
        </Child>
      </Wrapper>
    </Link>
  )
}

type Props = OwnProps

export default Exchange
