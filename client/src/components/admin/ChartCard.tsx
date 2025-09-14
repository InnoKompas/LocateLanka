import { type ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export const ChartCard = ({ title, description, children, action }: ChartCardProps) => {
  return (
    <Card>
      <CardHeader 
        title={title}
        description={description}
        action={action}
      />
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};
