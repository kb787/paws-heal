import React, { useState } from 'react';
import { BookOpen, Users, Brain, Trophy, ArrowRight, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Calendar from '../components/calendar/Calendar';

const Mentorship = () => {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00',
  ];

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-neon-purple" />,
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths driven by advanced AI algorithms',
    },
    {
      icon: <Users className="h-6 w-6 text-neon-purple" />,
      title: 'Enterprise Integration',
      description: 'Seamless integration with your existing enterprise systems',
    },
    {
      icon: <Brain className="h-6 w-6 text-neon-purple" />,
      title: 'Intelligent Insights',
      description: 'Real-time analytics and actionable intelligence',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-purple-400 text-transparent bg-clip-text sm:text-5xl md:text-6xl">
            Schedule Your AI Consultation
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Book a session with our AI experts to discover how Siva.AI can transform your enterprise
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            {selectedDate && (
              <Card className="mt-8 p-6 bg-gray-800 border border-neon-purple">
                <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-neon-purple" />
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        py-2 px-4 rounded-lg text-sm font-medium
                        ${selectedTime === time
                          ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50'
                          : 'text-gray-300 border border-gray-700 hover:border-gray-600'
                        }
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="p-6 bg-gray-800 border border-neon-purple">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-neon-purple/20 text-neon-purple">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-neon-purple">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-6 bg-gray-800 border border-neon-purple">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-neon-purple">
                    Selected Session
                  </h3>
                  {selectedDate && selectedTime ? (
                    <p className="mt-2 text-gray-400">
                      {selectedDate.toLocaleDateString()} at {selectedTime}
                    </p>
                  ) : (
                    <p className="mt-2 text-gray-400">
                      Please select a date and time
                    </p>
                  )}
                </div>
                <Button
                  disabled={!selectedDate || !selectedTime}
                  className="group bg-neon-purple text-black hover:bg-purple-500"
                >
                  Book Session
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
