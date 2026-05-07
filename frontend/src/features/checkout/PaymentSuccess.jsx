// PaymentSuccess.jsx
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, Mail, AlertTriangle } from 'lucide-react'
import orderService from './orderService'
import { extractApiError } from '../../shared/services/apiHelpers'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const [status, setStatus] = useState('unknown') // unknown | verified | failed
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const orderId = searchParams.get('orderId') || searchParams.get('order_id')
    const orderNumber = searchParams.get('orderNumber')
    const amount = searchParams.get('amount')

    // Never claim success based only on URL params.
    setOrderDetails(
      orderId || orderNumber || amount
        ? { orderId, orderNumber: orderNumber || orderId || null, amount: amount || null }
        : null
    )

    if (!orderId) {
      setStatus('unknown')
      return
    }

    const verify = async () => {
      setError(null)
      try {
        const res = await orderService.getOrder(orderId)
        if (res?.success) setStatus('verified')
        else setStatus('unknown')
      } catch (e) {
        const apiErr = extractApiError(e, 'Could not verify order status')
        setError(apiErr.message)
        setStatus('unknown')
      }
    }

    verify()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-sm p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          {status === 'verified' ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-700" />
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {status === 'verified' ? 'Order Verified' : 'Payment Redirect Complete'}
        </h1>
        
        <p className="text-gray-500 mb-6">
          {status === 'verified'
            ? 'Your order exists in our system.'
            : 'We could not automatically verify your order status. If you were charged but don’t see an order, please contact support with your order reference.'
          }
        </p>

        {error && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-sm">
            {error}
          </div>
        )}
        
        {orderDetails && (
          <div className="bg-gray-50 rounded-sm p-4 mb-6 text-left space-y-2">
            {orderDetails.orderNumber && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Number:</span>
                <span className="text-gray-900 font-medium">{orderDetails.orderNumber}</span>
              </div>
            )}
            {orderDetails.amount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="text-gray-900 font-medium">${orderDetails.amount}</span>
              </div>
            )}
          </div>
        )}

        {status === 'verified' && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
            <Mail size={16} />
            <span>Order confirmation may be sent to your email</span>
          </div>
        )}
        
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-gray-900 text-white py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/shop"
            className="block w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Browse More Products
          </Link>
        </div>
      </div>
    </div>
  )
}