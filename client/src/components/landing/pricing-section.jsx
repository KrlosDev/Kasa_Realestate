import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getRoles, getLicenseTypes } from '../../service/listingService';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Spinner } from '../ui/spinner';

export function PricingSection() {
  const [roles, setRoles] = useState([]);
  const [licenseTypes, setLicenseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rolesResponse, licenseTypesResponse] = await Promise.all([
          getRoles(true),
          getLicenseTypes()
        ]);
        
        if (rolesResponse.success) {
          setRoles(rolesResponse.data);
        }
        if (licenseTypesResponse.success) {
          setLicenseTypes(licenseTypesResponse.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load pricing information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSignup = (roleName, licenseTypeId) => {
    navigate({ to: '/signup', search: { role: roleName, licenseType: licenseTypeId } });
  };

  const getRoleLicenseTypes = (roleName) => {
    const isBroker = roleName.toLowerCase().includes('broker');
    return licenseTypes.filter(lt => lt.isForBrokers === isBroker);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-4">Pricing</h2>
        </div>
        
        <div className="space-y-16">
          {roles.map((role) => {
            const roleLicenseTypes = getRoleLicenseTypes(role.name);
            
            return (
              <div key={role._id}>
                <h3 className="text-xl font-medium text-foreground mb-4 capitalize">{role.name === "constructora"? "Business" : "Broker"} Plans</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {roleLicenseTypes.map((licenseType) => (
                    <Card 
                      key={licenseType._id} 
                      className={`flex flex-col relative bg-card ${
                        licenseType.isFeatured ? 'border-primary border-2 shadow-lg' : 'border-none'
                      }`}
                    >
                      <CardHeader className="pb-8">
                        <div className="flex items-center justify-between mb-4">
                          <CardTitle className="text-2xl font-semibold capitalize">
                            {licenseType.name}
                          </CardTitle>
                          {licenseType.isFeatured && (
                            <Badge variant="default" className="bg-primary text-primary-foreground">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <div>
                          <span className="text-4xl font-bold">
                            ${licenseType.price}
                          </span>
                          <span className="text-muted-foreground">
                            /mo.
                          </span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="grow space-y-4 pb-6">
                        <div>
                          <p className="text-sm font-medium mb-3">
                            {role.features && role.features.length > 0 
                              ? 'Includes:' 
                              : `Up to ${licenseType.maxUsers} ${licenseType.maxUsers === 1 ? 'user' : 'users'}`
                            }
                          </p>
                          
                          {role.features && role.features.length > 0 && (
                            <ul className="space-y-2.5">
                              {role.features.map((feature, index) => (
                                <li key={index} className="flex items-start text-sm">
                                  <span className="mr-2.5 text-primary mt-0.5">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          {role.permissions && role.permissions.length > 0 && (
                            <ul className="space-y-2.5 mt-4">
                              {role.permissions.slice(0, 4).map((permission, index) => (
                                <li key={index} className="flex items-start text-sm">
                                  <span className="mr-2.5 text-primary mt-0.5">✓</span>
                                  <span>{permission}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0">
                        <Button 
                          className={`w-full ${licenseType.isFeatured ? '' : 'variant-outline'}`}
                          variant={licenseType.isFeatured ? 'default' : 'outline'}
                          size="lg"
                          onClick={() => handleSignup(role.name, licenseType._id)}
                        >
                          Get <span className='capitalize'>{licenseType.name}</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
