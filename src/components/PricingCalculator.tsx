import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Users, DollarSign, Percent, AlertCircle } from 'lucide-react';

interface PricingDetails {
  basePrice: number;
  participants: number;
  pricePerPerson: number;
  totalPrice: number;
  discountApplied: number;
  discountPercentage: number;
  pricingPolicy: string;
  bulkDiscountThreshold?: number;
  minRequired?: number;
  maxAllowed?: number;
}

interface PricingCalculatorProps {
  tourId: number;
  onPriceChange?: (details: PricingDetails) => void;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({ tourId, onPriceChange }) => {
  const [participants, setParticipants] = useState(1);
  const [pricingDetails, setPricingDetails] = useState<PricingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePrice = async (participantCount: number) => {
    if (!tourId || participantCount < 1) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calculate-tour-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId,
          participants: participantCount
        })
      });

      const data = await response.json();

      if (data.success) {
        setPricingDetails(data.data);
        onPriceChange?.(data.data);
      } else {
        setError(data.error || 'Failed to calculate price');
      }
    } catch (error) {
      console.error('Price calculation error:', error);
      setError('Failed to calculate price');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculatePrice(participants);
  }, [tourId, participants]);

  const handleParticipantsChange = (value: string) => {
    const newCount = parseInt(value) || 1;
    setParticipants(newCount);
  };

  const getPricingPolicyInfo = () => {
    if (!pricingDetails) return null;

    switch (pricingDetails.pricingPolicy) {
      case 'fixed':
        return {
          title: 'Fixed Price',
          description: 'Same price for all participants',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'bulk_discount':
        return {
          title: 'Bulk Discount',
          description: `${pricingDetails.discountPercentage}% off for ${pricingDetails.bulkDiscountThreshold}+ participants`,
          color: 'bg-green-100 text-green-800'
        };
      case 'group_required':
        return {
          title: 'Group Required',
          description: `Minimum ${pricingDetails.minRequired} participants required`,
          color: 'bg-orange-100 text-orange-800'
        };
      default:
        return null;
    }
  };

  const policyInfo = getPricingPolicyInfo();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Price Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="participants">Number of Participants</Label>
          <Input
            id="participants"
            type="number"
            min="1"
            max="50"
            value={participants}
            onChange={(e) => handleParticipantsChange(e.target.value)}
            className="mt-1"
          />
        </div>

        {policyInfo && (
          <div className="flex items-center gap-2">
            <Badge className={policyInfo.color}>
              {policyInfo.title}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {policyInfo.description}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {pricingDetails && !loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Per Person</span>
                </div>
                <div className="text-2xl font-bold">
                  ${pricingDetails.pricePerPerson.toFixed(2)}
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary">Total Price</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  ${pricingDetails.totalPrice.toFixed(2)}
                </div>
              </div>
            </div>

            {pricingDetails.discountApplied > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Discount Applied</span>
                </div>
                <div className="text-lg font-semibold text-green-700">
                  -${pricingDetails.discountApplied.toFixed(2)} ({pricingDetails.discountPercentage}% off)
                </div>
                <div className="text-sm text-green-600">
                  You saved ${pricingDetails.discountApplied.toFixed(2)} with {participants} participants!
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Base price: ${pricingDetails.basePrice.toFixed(2)} per person
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;
