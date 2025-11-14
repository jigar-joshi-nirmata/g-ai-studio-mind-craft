
import React from 'react';
import Card from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 59 },
  { name: 'Mar', score: 80 },
  { name: 'Apr', score: 81 },
  { name: 'May', score: 56 },
  { name: 'Jun', score: 75 },
  { name: 'Jul', score: 90 },
];

const Profile: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile & Progress</h1>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                            borderColor: 'rgba(255, 255, 255, 0.2)'
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
