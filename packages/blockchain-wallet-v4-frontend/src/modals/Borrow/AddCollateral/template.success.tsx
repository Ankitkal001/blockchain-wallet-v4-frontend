import { BorrowFormValuesType } from 'data/components/borrow/types'
import {
  Button,
  HeartbeatLoader,
  Icon,
  Text,
  TooltipHost
} from 'blockchain-info-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, FormLabel, NumberBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType, OwnProps, State, SuccessStateType } from '.'
import { maximumAmount, minimumAmount } from '../BorrowForm/validation'
import { model, selectors } from 'data'
import BorrowCoinDropdown from '../BorrowForm/BorrowCoinDropdown'
import QRCodeWrapper from 'components/QRCodeWrapper'
import React from 'react'
import styled from 'styled-components'

const { getCollateralAmtRequired } = model.components.borrow

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`

const CustomFormLabel = styled(FormLabel)`
  display: block;
  margin-top: 24px;
`

const CustomField = styled(Field)`
  > input {
    padding-left: 50px;
  }
`

const AmountFieldContainer = styled.div`
  display: flex;
  position: relative;
`

const PrincipalCcyAbsolute = styled.div`
  position: absolute;
  top: 16px;
  left: 12px;
`

const MaxAmountContainer = styled.div`
  align-items: center;
  display: flex;
  margin-top: 40px;
`

const QRCodeContainer = styled.div`
  cursor: pointer;
`
const QRTitle = styled.div`
  display: flex;
  margin: 24px 0;
`
const QRCodeBox = styled.div`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.grey000};
`
const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const Note = styled.div`
  margin-top: 24px;
  margin-left: 24px;
`

const FiatContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: ${props => props.theme.grey000};
`

type LinkStatePropsType = {
  values?: BorrowFormValuesType
}

export type Props = OwnProps &
  SuccessStateType &
  LinkDispatchPropsType &
  LinkStatePropsType &
  State & { onCopyAddress: () => void; onToggleQrCode: () => void }

const Success: React.FC<InjectedFormProps & Props> = props => {
  return (
    <CustomForm onSubmit={props.handleSubmit}>
      <Top>
        <TopText color='grey900' size='20px' weight={600}>
          <Icon
            cursor
            style={{ marginRight: '24px' }}
            name='arrow-left'
            size='20px'
            color='grey600'
            onClick={() =>
              props.borrowActions.setStep({
                step: 'DETAILS',
                loan: props.loan,
                offer: props.offer
              })
            }
          />
          <FormattedMessage
            id='modals.borrow.addingcollateral'
            defaultMessage='Adding Collateral'
          />
        </TopText>
        <MaxAmountContainer>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.needtoadd'
              defaultMessage='You need to add'
            />{' '}
            <FiatContainer
              onClick={() =>
                props.borrowActions.handleAddCollateralRequiredClick()
              }
            >
              <Text cursor='pointer' color='blue600' size='14px' weight={500}>
                {'$' + getCollateralAmtRequired(props.loan, props.offer)}
              </Text>
            </FiatContainer>{' '}
            <FormattedMessage
              id='modals.borrow.additionalcollateral'
              defaultMessage='of additional collateral to avoid being liquidated.'
            />
          </Text>
        </MaxAmountContainer>
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.collateralfrom'
              defaultMessage='Send collateral from'
            />
          </Text>
        </CustomFormLabel>
        <BorrowCoinDropdown {...props} />
        <CustomFormLabel>
          <Text color='grey600' weight={500} size='14px'>
            <FormattedMessage
              id='modals.borrow.enteradditional'
              defaultMessage='Enter additional collateral'
            />
          </Text>
        </CustomFormLabel>
        <AmountFieldContainer>
          <CustomField
            component={NumberBox}
            data-e2e='additionalCollateralInput'
            name='additionalCollateral'
            validate={[maximumAmount, minimumAmount]}
          />
          <PrincipalCcyAbsolute>
            <Text color='grey400' size='14px' weight={600}>
              USD
            </Text>
          </PrincipalCcyAbsolute>
        </AmountFieldContainer>
        <QRCodeContainer>
          <QRTitle onClick={() => props.onToggleQrCode()}>
            <Icon
              name='qr-code'
              color='blue600'
              style={{ marginRight: '12px' }}
            />
            <Text size='14px' color='blue600' weight={500}>
              <FormattedMessage
                id='modals.borrow.addcollateral.send'
                defaultMessage='Send additional collateral from external wallet'
              />
            </Text>
          </QRTitle>
          {props.showQrCode && (
            <QRCodeBox>
              <QRCodeWrapper
                value={
                  props.loan.collateral.depositAddresses[
                    props.offer.terms.collateralCcy
                  ]
                }
                size={160}
              />
              <div style={{ width: '100%' }}>
                <IconContainer>
                  <Icon
                    onClick={() => props.onToggleQrCode()}
                    name='close'
                    color='grey600'
                  />
                </IconContainer>
                <Note>
                  <Text size='12px' weight={600} color='grey700'>
                    Note
                  </Text>
                  <Text
                    size='12px'
                    weight={500}
                    color='grey600'
                    style={{ marginTop: '4px', marginBottom: '24px' }}
                  >
                    <FormattedMessage
                      id='modals.borrow.addcollateralform.sendcollateral'
                      defaultMessage='You can send any amount of {ccy} to this address.'
                      values={{
                        ccy: props.offer.terms.collateralCcy
                      }}
                    />
                  </Text>
                  {props.isAddrCopied ? (
                    <TooltipHost id='copied'>
                      <Button nature='light'>
                        <FormattedMessage
                          id='modals.borrow.addcollateralform.copy'
                          defaultMessage='Copy Address'
                        />
                      </Button>
                    </TooltipHost>
                  ) : (
                    <Button
                      nature='light'
                      onClick={() => props.onCopyAddress()}
                    >
                      <FormattedMessage
                        id='modals.borrow.addcollateralform.copy'
                        defaultMessage='Copy Address'
                      />
                    </Button>
                  )}
                </Note>
              </div>
            </QRCodeBox>
          )}
        </QRCodeContainer>
      </Top>
      <Bottom>
        <Button
          nature='primary'
          type='submit'
          data-e2e='addCollateralSubmit'
          disabled={props.submitting || props.invalid}
          fullwidth
        >
          {props.submitting ? (
            <HeartbeatLoader height='16px' width='16px' color='white' />
          ) : (
            <Text size='16px' weight={600} color='white'>
              <FormattedMessage
                id='modals.borrow.addcollateralform.addcollateral'
                defaultMessage='Add Collateral'
              />
            </Text>
          )}
        </Button>
      </Bottom>
    </CustomForm>
  )
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('borrowForm')(state)
})

const enhance = compose<any>(
  reduxForm({ form: 'borrowForm', destroyOnUnmount: false }),
  connect(mapStateToProps)
)

export default enhance(Success)