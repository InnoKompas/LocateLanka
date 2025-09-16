import { useState } from 'react';
import { DocsSection } from '../shared/DocsSection';
import { Button } from '../../ui/Button';

interface CommunityPost {
  id: string;
  title: string;
  author: string;
  avatar: React.ReactNode;
  timestamp: string;
  category: string;
  replies: number;
  likes: number;
  tags: string[];
  excerpt: string;
}

interface Contributor {
  name: string;
  avatar: React.ReactNode;
  role: string;
  contributions: number;
  specialties: string[];
}

interface ShowcaseProject {
  name: string;
  description: string;
  tech: string[];
  image: React.ReactNode;
  author: string;
}

export const CommunitySection = () => {
  const [activeTab, setActiveTab] = useState<'forum' | 'contributors' | 'showcase' | 'events'>('forum');

  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      title: 'Best practices for caching location data in React applications',
      author: 'DevSara',
      avatar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      timestamp: '2 hours ago',
      category: 'Best Practices',
      replies: 12,
      likes: 24,
      tags: ['React', 'Caching', 'Performance'],
      excerpt: 'I\'ve been working on optimizing my React app that uses the LankaLocate API extensively. Here are some caching strategies that have worked well...'
    },
    {
      id: '2',
      title: 'Building a location picker component with autocomplete',
      author: 'CodeMaster',
      avatar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      timestamp: '1 day ago',
      category: 'Tutorials',
      replies: 8,
      likes: 31,
      tags: ['JavaScript', 'UI/UX', 'Autocomplete'],
      excerpt: 'Step-by-step guide to creating a beautiful location picker with search functionality using the LankaLocate API...'
    },
    {
      id: '3',
      title: 'Rate limiting strategies for high-traffic applications',
      author: 'TechLead',
      avatar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5" />
        </svg>
      ),
      timestamp: '3 days ago',
      category: 'Architecture',
      replies: 15,
      likes: 42,
      tags: ['Architecture', 'Performance', 'Rate Limiting'],
      excerpt: 'Sharing our approach to handling API rate limits in a high-traffic e-commerce application with millions of users...'
    },
    {
      id: '4',
      title: 'Integrating with mapping libraries: Leaflet vs Google Maps',
      author: 'GeoExpert',
      avatar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      timestamp: '1 week ago',
      category: 'Integration',
      replies: 20,
      likes: 56,
      tags: ['Maps', 'Leaflet', 'Google Maps'],
      excerpt: 'Comparison of different mapping libraries when working with Sri Lankan location data. Performance, features, and cost analysis...'
    }
  ];

  const contributors: Contributor[] = [
    {
      name: 'Saman Perera',
      avatar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      role: 'Core Maintainer',
      contributions: 127,
      specialties: ['API Design', 'Performance', 'Documentation']
    },
    {
      name: 'Priya Silva',
      avatar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      role: 'Community Manager',
      contributions: 89,
      specialties: ['Community Building', 'Support', 'Content']
    },
    {
      name: 'Ranil Fernando',
      avatar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      role: 'Senior Developer',
      contributions: 156,
      specialties: ['Frontend', 'React', 'TypeScript']
    },
    {
      name: 'Malini Wickrama',
      avatar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      role: 'Data Specialist',
      contributions: 73,
      specialties: ['GIS', 'Data Quality', 'Mapping']
    }
  ];

  const showcaseProjects: ShowcaseProject[] = [
    {
      name: 'DeliveryLK',
      description: 'Food delivery platform with precise location tracking',
      tech: ['React Native', 'Node.js', 'MongoDB'],
      image: (
        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      author: 'FoodTech Solutions'
    },
    {
      name: 'PropertyFinder',
      description: 'Real estate platform with advanced location search',
      tech: ['Vue.js', 'Python', 'PostgreSQL'],
      image: (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      author: 'PropTech Innovations'
    },
    {
      name: 'RideShare',
      description: 'Ride-sharing app with optimized route planning',
      tech: ['Flutter', 'Go', 'Redis'],
      image: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      author: 'MobilityLK'
    },
    {
      name: 'FieldService',
      description: 'Field service management with location intelligence',
      tech: ['Angular', 'Java', 'MySQL'],
      image: (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      author: 'ServiceTech'
    }
  ];

  const upcomingEvents = [
    {
      title: 'LankaLocate Developer Meetup',
      date: '2024-02-15',
      time: '6:00 PM - 8:00 PM',
      location: 'Virtual Event',
      type: 'Meetup',
      description: 'Monthly community meetup featuring API updates, developer showcases, and networking.'
    },
    {
      title: 'Building Location-Aware Applications Workshop',
      date: '2024-02-22',
      time: '2:00 PM - 5:00 PM',
      location: 'Colombo, Sri Lanka',
      type: 'Workshop',
      description: 'Hands-on workshop covering best practices for location-based applications.'
    },
    {
      title: 'API v2.0 Beta Preview',
      date: '2024-03-01',
      time: '10:00 AM - 11:00 AM',
      location: 'Virtual Event',
      type: 'Preview',
      description: 'Exclusive preview of upcoming API features and breaking changes.'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Best Practices': 'bg-green-100 text-green-800',
      'Tutorials': 'bg-blue-100 text-blue-800',
      'Architecture': 'bg-purple-100 text-purple-800',
      'Integration': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DocsSection 
      title="Community"
      description="Join our vibrant developer community, share knowledge, showcase projects, and connect with fellow developers"
    >
      <div className="space-y-8">
        {/* Community Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-heading-3">Community at a Glance</h3>
          </div>
          <div className="card-body">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">2,500+</div>
              <div className="text-sm text-text-secondary">Active Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">450+</div>
              <div className="text-sm text-text-secondary">Forum Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">120+</div>
              <div className="text-sm text-text-secondary">Projects Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">25+</div>
              <div className="text-sm text-text-secondary">Countries</div>
            </div>
          </div>
          </div>
        </div>

        {/* Community Navigation */}
        <div className="card">
          <div className="card-body">
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'forum', name: 'Forum', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ) },
                { id: 'contributors', name: 'Contributors', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                ) },
                { id: 'showcase', name: 'Showcase', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ) },
                { id: 'events', name: 'Events', icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ) }
              ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-800 border border-primary-200'
                    : 'bg-surface-variant text-text-secondary hover:bg-primary-50'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </Button>
            ))}
          </div>

          {/* Forum Tab */}
          {activeTab === 'forum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-text-primary">Recent Discussions</h4>
                <Button className="btn btn-primary btn-sm">Start Discussion</Button>
              </div>
              
              {communityPosts.map((post) => (
                <div key={post.id} className="border border-border rounded-lg p-4 hover:border-primary-200 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{post.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="font-medium text-text-primary hover:text-primary-600 cursor-pointer">
                          {post.title}
                        </h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      
                      <p className="text-sm text-text-secondary mb-3">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-text-secondary">
                          <span>By {post.author}</span>
                          <span>{post.timestamp}</span>
                          <span>{post.replies} replies</span>
                          <span>{post.likes} likes</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          {post.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-surface-variant text-xs rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All Discussions →
                </button>
              </div>
            </div>
          )}

          {/* Contributors Tab */}
          {activeTab === 'contributors' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-text-primary mb-4">Top Contributors</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contributors.map((contributor) => (
                    <div key={contributor.name} className="border border-border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">{contributor.avatar}</div>
                        <div>
                          <div className="font-medium text-text-primary">{contributor.name}</div>
                          <div className="text-sm text-text-secondary">{contributor.role}</div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-lg font-bold text-primary-600">{contributor.contributions}</div>
                          <div className="text-xs text-text-secondary">contributions</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {contributor.specialties.map((specialty) => (
                          <span key={specialty} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h5 className="font-medium text-primary-800 mb-2">Become a Contributor</h5>
                <p className="text-sm text-primary-700 mb-3">
                  Help improve the LankaLocate API and community resources. Contributors get early access to new features and special recognition.
                </p>
                <div className="flex space-x-3">
                  <Button className="btn btn-primary btn-sm">Contribute Code</Button>
                  <Button className="btn btn-outline btn-sm">Write Documentation</Button>
                </div>
              </div>
            </div>
          )}

          {/* Showcase Tab */}
          {activeTab === 'showcase' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-text-primary">Community Projects</h4>
                <Button className="btn btn-primary btn-sm">Submit Project</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {showcaseProjects.map((project) => (
                  <div key={project.name} className="border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="text-3xl">{project.image}</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-text-primary mb-1">{project.name}</h5>
                        <p className="text-sm text-text-secondary mb-2">{project.description}</p>
                        <div className="text-xs text-text-secondary">By {project.author}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-surface-variant text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-surface-variant rounded-lg p-4">
                <h5 className="font-medium text-text-primary mb-2">Share Your Project</h5>
                <p className="text-sm text-text-secondary mb-3">
                  Built something awesome with the LankaLocate API? Share it with the community and get featured in our showcase!
                </p>
                <Button className="btn btn-primary btn-sm">Submit Your Project</Button>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-text-primary mb-4">Upcoming Events</h4>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-text-primary mb-1">{event.title}</h5>
                          <p className="text-sm text-text-secondary mb-2">{event.description}</p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                          {event.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Button className="btn btn-primary btn-sm">Register</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-800 mb-2">Host an Event</h5>
                <p className="text-sm text-green-700 mb-3">
                  Want to organize a LankaLocate API workshop or meetup in your area? We'll help promote it and provide resources!
                </p>
                <Button className="btn btn-primary btn-sm">Propose Event</Button>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-heading-3">Community Guidelines</h3>
          </div>
          <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-medium text-text-primary">Do</h4>
              </div>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Be respectful and constructive in discussions</li>
                <li>• Share knowledge and help other developers</li>
                <li>• Provide clear examples and code snippets</li>
                <li>• Search before posting duplicate questions</li>
                <li>• Follow up on your questions with solutions</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-medium text-text-primary">Don't</h4>
              </div>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>• Share API keys or sensitive information</li>
                <li>• Post spam or promotional content</li>
                <li>• Use offensive language or harassment</li>
                <li>• Ask for free work or spec projects</li>
                <li>• Cross-post the same question multiple times</li>
              </ul>
            </div>
          </div>
          </div>
        </div>

        {/* Join Community */}
        <div className="card card-elevated" style={{background: 'linear-gradient(to right, var(--color-primary-500), var(--color-primary-600))'}}>
          <div className="card-body text-center text-white">
            <h3 className="text-display-2 mb-2">Join Our Community</h3>
            <p className="text-primary-100 mb-6">
              Connect with thousands of developers building amazing location-aware applications
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="btn bg-white text-primary-600 hover:bg-primary-50">
                Join Discord
              </Button>
              <Button className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Follow on Twitter
              </Button>
              <Button className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DocsSection>
  );
};