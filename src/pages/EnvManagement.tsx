
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Code, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { getCurrentEnvironment } from '@/integrations/supabase/client';
import EnvironmentIndicator from '@/components/EnvironmentIndicator';

const EnvManagement = () => {
  const [sqlScript, setSqlScript] = useState('');
  const currentEnv = getCurrentEnvironment();
  const isProduction = currentEnv === 'production';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-3">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Environment Management</h1>
        </div>
        <EnvironmentIndicator compact />
      </div>

      <EnvironmentIndicator />

      <div className="mt-8 space-y-6">
        <Tabs defaultValue="database">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="database">
              <Database className="mr-2 h-4 w-4" />
              Database Migration
            </TabsTrigger>
            <TabsTrigger value="config">
              <Code className="mr-2 h-4 w-4" />
              Environment Configuration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="database" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Migration</CardTitle>
                <CardDescription>
                  Transfer database schema and data between environments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">How to migrate from Staging to Production:</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Connect to your Supabase staging project</li>
                      <li>Go to the SQL Editor</li>
                      <li>Export your schema changes</li>
                      <li>Paste the schema SQL here to review</li>
                      <li>Connect to your Supabase production project and apply the SQL</li>
                    </ol>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="sql-script" className="font-medium block mb-2">
                      SQL Migration Script
                    </label>
                    <Textarea
                      id="sql-script"
                      placeholder="-- Paste your SQL migration script here"
                      className="font-mono text-sm h-64"
                      value={sqlScript}
                      onChange={(e) => setSqlScript(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setSqlScript('')}>Clear</Button>
                    <Button 
                      onClick={() => {
                        // In a real app, this could show a modal with instructions
                        // or even automate the process with proper authentication
                        alert("In a production app, this would copy the SQL to clipboard or guide you through applying it to production.");
                      }}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Prepare for Migration
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="config" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Environment Configuration</CardTitle>
                <CardDescription>
                  Manage your environment settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Current Environment Setup:</h3>
                    <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                      <pre>{`VITE_APP_ENV=${currentEnv}
${!isProduction ? 'VITE_STAGING_SUPABASE_URL=YOUR_STAGING_URL\nVITE_STAGING_SUPABASE_KEY=YOUR_STAGING_KEY' : ''}`}</pre>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Switching Environments:</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      To switch between environments, set these environment variables before building or running the app:
                    </p>
                    <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                      <pre>{`# For production
VITE_APP_ENV=production

# For staging
VITE_APP_ENV=staging
VITE_STAGING_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_STAGING_SUPABASE_KEY=your-staging-project-anon-key`}</pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnvManagement;
