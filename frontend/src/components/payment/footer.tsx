import { Mail, MessageCircle, Phone, Linkedin, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-muted-foreground">Conversly.ai - Transforming customer interactions with AI-powered solutions.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Home</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span className="text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <a href="mailto:tyagishashank118@gmail.com" className="text-muted-foreground hover:text-primary">info@conversly.ai</a>
              </li>
              <li className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                <a href="https://wa.me/9528921966" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">WhatsApp</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://x.com/tyagi_Shashankk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/shas007" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Conversly.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
