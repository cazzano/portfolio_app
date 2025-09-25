from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen, SlideTransition
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.scrollview import ScrollView
from kivy.uix.widget import Widget
from kivy.graphics import Color, Rectangle, RoundedRectangle, Line
from kivy.animation import Animation
from kivy.metrics import dp
from kivy.core.window import Window
from kivy.config import Config
import platform

# FORCE PORTRAIT ORIENTATION - This is the key fix!
Config.set('graphics', 'orientation', 'portrait')

# Additional window configurations for mobile
if platform.system() == 'Android':
    from android.permissions import request_permissions, Permission
    # Request necessary permissions
    request_permissions([Permission.WRITE_EXTERNAL_STORAGE, Permission.READ_EXTERNAL_STORAGE])

# Set window size for development (will be ignored on mobile)
Window.size = (360, 640)  # Portrait aspect ratio
Window.clearcolor = (0.05, 0.05, 0.08, 1)

# Lock orientation function for Android
def lock_orientation():
    try:
        from jnius import autoclass
        PythonActivity = autoclass('org.kivy.android.PythonActivity')
        activity = PythonActivity.mActivity
        
        # Force portrait orientation
        # ActivityInfo.SCREEN_ORIENTATION_PORTRAIT = 1
        activity.setRequestedOrientation(1)
    except:
        # Not on Android or jnius not available
        pass

class MaterialCard(BoxLayout):
    def __init__(self, elevation=4, radius=12, bg_color=(0.12, 0.12, 0.15, 1), **kwargs):
        super().__init__(**kwargs)
        self.elevation = elevation
        self.radius = radius
        self.bg_color = bg_color
        
        with self.canvas.before:
            # Shadow effect
            Color(0, 0, 0, 0.3)
            self.shadow_rect = RoundedRectangle(
                radius=[radius] * 4,
                size=self.size,
                pos=(self.x + elevation/2, self.y - elevation/2)
            )
            
            # Main card
            Color(*bg_color)
            self.bg_rect = RoundedRectangle(
                radius=[radius] * 4,
                size=self.size,
                pos=self.pos
            )
            
        self.bind(size=self.update_graphics, pos=self.update_graphics)
    
    def update_graphics(self, *args):
        self.shadow_rect.size = self.size
        self.shadow_rect.pos = (self.x + self.elevation/2, self.y - self.elevation/2)
        self.bg_rect.size = self.size
        self.bg_rect.pos = self.pos

class MaterialButton(Button):
    def __init__(self, bg_color=(0.2, 0.6, 1, 1), text_color=(1, 1, 1, 1), radius=25, **kwargs):
        super().__init__(**kwargs)
        self.background_color = (0, 0, 0, 0)  # Transparent default background
        self.color = text_color
        self.bg_color = bg_color
        self.radius = radius
        self.font_size = dp(16)
        
        with self.canvas.before:
            Color(*bg_color)
            self.bg_rect = RoundedRectangle(
                radius=[radius] * 4,
                size=self.size,
                pos=self.pos
            )
            
        self.bind(size=self.update_bg, pos=self.update_bg)
        self.bind(on_press=self.on_button_press)
        self.bind(on_release=self.on_button_release)
    
    def update_bg(self, *args):
        self.bg_rect.size = self.size
        self.bg_rect.pos = self.pos
    
    def on_button_press(self, *args):
        # Scale down animation
        anim = Animation(size=(self.width * 0.95, self.height * 0.95), duration=0.1)
        anim.start(self)
    
    def on_button_release(self, *args):
        # Scale back up animation
        anim = Animation(size=(self.width / 0.95, self.height / 0.95), duration=0.1)
        anim.start(self)

class HomeScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = 'home'
        
        # Main scroll view for better mobile experience
        scroll = ScrollView()
        main_layout = BoxLayout(
            orientation='vertical', 
            padding=dp(16), 
            spacing=dp(16),
            size_hint_y=None
        )
        main_layout.bind(minimum_height=main_layout.setter('height'))
        
        # Hero section - Optimized for portrait
        hero_card = MaterialCard(
            size_hint_y=None,
            height=dp(320),  # Increased height for portrait
            elevation=8,
            bg_color=(0.15, 0.15, 0.2, 1)
        )
        
        hero_layout = BoxLayout(orientation='vertical', padding=dp(20), spacing=dp(12))
        
        # Profile section - Stack vertically for portrait
        profile_section = BoxLayout(orientation='vertical', size_hint_y=0.7, spacing=dp(16))
        
        # Avatar centered
        avatar_container = BoxLayout(orientation='horizontal', size_hint_y=0.4)
        avatar_widget = Widget(size_hint_x=None, width=dp(120))
        with avatar_widget.canvas:
            Color(0.2, 0.6, 1, 1)
            avatar_bg = RoundedRectangle(radius=[60] * 4, size=(dp(120), dp(120)), pos=(0, 0))
            Color(1, 1, 1, 1)
        
        def update_avatar(*args):
            avatar_bg.pos = (avatar_widget.x, avatar_widget.y + (avatar_widget.height - dp(120))/2)
        
        avatar_widget.bind(pos=update_avatar, size=update_avatar)
        avatar_container.add_widget(Widget())  # Spacer
        avatar_container.add_widget(avatar_widget)
        avatar_container.add_widget(Widget())  # Spacer
        
        # Profile text - Centered for portrait
        profile_text = BoxLayout(orientation='vertical', size_hint_y=0.6)
        
        name_label = Label(
            text='Sarah Johnson',
            font_size=dp(26),
            bold=True,
            color=(1, 1, 1, 1),
            size_hint_y=0.3,
            halign='center'
        )
        name_label.bind(size=name_label.setter('text_size'))
        
        title_label = Label(
            text='UI/UX Designer & Flutter Developer',
            font_size=dp(15),
            color=(0.7, 0.8, 1, 1),
            size_hint_y=0.3,
            halign='center'
        )
        title_label.bind(size=title_label.setter('text_size'))
        
        bio_label = Label(
            text='Creating beautiful, functional mobile experiences with 6+ years of expertise in design and development.',
            font_size=dp(13),
            color=(0.8, 0.8, 0.8, 1),
            size_hint_y=0.4,
            halign='center',
            text_size=(None, None)
        )
        bio_label.bind(size=bio_label.setter('text_size'))
        
        profile_text.add_widget(name_label)
        profile_text.add_widget(title_label)
        profile_text.add_widget(bio_label)
        
        profile_section.add_widget(avatar_container)
        profile_section.add_widget(profile_text)
        
        # Stats section - Better spacing for portrait
        stats_layout = GridLayout(cols=3, size_hint_y=0.3, spacing=dp(12))
        
        stats_data = [
            ('🚀', '25+', 'Projects'),
            ('⭐', '6', 'Years Exp'),
            ('👥', '50+', 'Happy Clients')
        ]
        
        for icon, value, label in stats_data:
            stat_card = MaterialCard(
                bg_color=(0.1, 0.1, 0.15, 1),
                radius=12
            )
            stat_layout = BoxLayout(orientation='vertical', padding=dp(8))
            
            icon_label = Label(
                text=icon,
                font_size=dp(20),
                size_hint_y=0.3
            )
            
            value_label = Label(
                text=value,
                font_size=dp(16),
                bold=True,
                color=(0.2, 0.6, 1, 1),
                size_hint_y=0.4
            )
            
            label_text = Label(
                text=label,
                font_size=dp(10),
                color=(0.7, 0.7, 0.7, 1),
                size_hint_y=0.3
            )
            
            stat_layout.add_widget(icon_label)
            stat_layout.add_widget(value_label)
            stat_layout.add_widget(label_text)
            stat_card.add_widget(stat_layout)
            stats_layout.add_widget(stat_card)
        
        hero_layout.add_widget(profile_section)
        hero_layout.add_widget(stats_layout)
        hero_card.add_widget(hero_layout)
        
        # Navigation section - Stack vertically for portrait
        nav_card = MaterialCard(
            size_hint_y=None,
            height=dp(180),  # Increased for vertical layout
            bg_color=(0.1, 0.1, 0.13, 1)
        )
        
        nav_layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(12))
        
        nav_buttons = [
            ('📱 Projects', (0.2, 0.6, 1, 1), 'projects'),
            ('🛠️ Skills', (0.2, 0.8, 0.4, 1), 'skills'),
            ('📧 Contact', (0.8, 0.4, 0.2, 1), 'contact')
        ]
        
        for text, color, screen in nav_buttons:
            btn = MaterialButton(
                text=text,
                bg_color=color,
                size_hint_y=None,
                height=dp(45)
            )
            btn.bind(on_press=lambda x, s=screen: self.switch_screen(s))
            nav_layout.add_widget(btn)
        
        nav_card.add_widget(nav_layout)
        
        # Quick about section
        about_card = MaterialCard(
            size_hint_y=None,
            height=dp(140),
            bg_color=(0.08, 0.12, 0.08, 1)
        )
        
        about_layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(8))
        
        about_title = Label(
            text='✨ About Me',
            font_size=dp(18),
            bold=True,
            color=(0.2, 0.8, 0.4, 1),
            size_hint_y=0.3,
            halign='center'
        )
        about_title.bind(size=about_title.setter('text_size'))
        
        about_text = Label(
            text='Passionate about creating intuitive user experiences and bringing ideas to life through code. I specialize in Flutter development and modern UI/UX design principles.',
            font_size=dp(13),
            color=(0.8, 0.8, 0.8, 1),
            size_hint_y=0.7,
            halign='center',
            text_size=(None, None)
        )
        about_text.bind(size=about_text.setter('text_size'))
        
        about_layout.add_widget(about_title)
        about_layout.add_widget(about_text)
        about_card.add_widget(about_layout)
        
        main_layout.add_widget(hero_card)
        main_layout.add_widget(nav_card)
        main_layout.add_widget(about_card)
        
        scroll.add_widget(main_layout)
        self.add_widget(scroll)
    
    def switch_screen(self, screen_name):
        self.manager.transition = SlideTransition(direction='left')
        self.manager.current = screen_name

class ProjectsScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = 'projects'
        
        main_layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(12))
        
        # App Bar
        app_bar = MaterialCard(
            size_hint_y=None,
            height=dp(60),
            bg_color=(0.15, 0.15, 0.2, 1),
            elevation=6
        )
        
        app_bar_layout = BoxLayout(orientation='horizontal', padding=dp(12), spacing=dp(12))
        
        back_btn = MaterialButton(
            text='← Back',
            size_hint_x=0.3,
            bg_color=(0.3, 0.3, 0.3, 1),
            size_hint_y=None,
            height=dp(36)
        )
        back_btn.bind(on_press=lambda x: self.go_back())
        
        title_label = Label(
            text='My Projects',
            font_size=dp(20),
            bold=True,
            color=(1, 1, 1, 1),
            size_hint_x=0.7,
            halign='left'
        )
        title_label.bind(size=title_label.setter('text_size'))
        
        app_bar_layout.add_widget(back_btn)
        app_bar_layout.add_widget(title_label)
        app_bar.add_widget(app_bar_layout)
        
        # Projects scroll
        scroll = ScrollView()
        projects_layout = BoxLayout(orientation='vertical', spacing=dp(12), size_hint_y=None)
        projects_layout.bind(minimum_height=projects_layout.setter('height'))
        
        projects_data = [
            {
                'name': '🛒 ShopEasy - E-Commerce App',
                'tech': 'Flutter • Firebase • Stripe API',
                'desc': 'Beautiful shopping app with real-time inventory, secure payments, and personalized recommendations.',
                'status': 'Live',
                'color': (0.2, 0.6, 1, 1)
            },
            {
                'name': '🌤️ WeatherPro - Weather App',
                'tech': 'Flutter • OpenWeather API • Location',
                'desc': 'Elegant weather app with animated backgrounds, hourly forecasts, and weather alerts.',
                'status': 'Live',
                'color': (0.2, 0.8, 0.4, 1)
            },
            {
                'name': '📋 TaskFlow - Project Manager',
                'tech': 'Flutter • Node.js • MongoDB',
                'desc': 'Collaborative task management with real-time sync, team chat, and progress tracking.',
                'status': 'Beta',
                'color': (0.8, 0.4, 0.2, 1)
            },
            {
                'name': '🎵 MusicVibe - Streaming App',
                'tech': 'Flutter • REST API • SQLite',
                'desc': 'Music streaming app with playlists, offline mode, and social sharing features.',
                'status': 'Development',
                'color': (0.6, 0.2, 0.8, 1)
            },
            {
                'name': '💰 FinanceTracker - Budget App',
                'tech': 'Flutter • Charts • Local Storage',
                'desc': 'Personal finance management with expense tracking, budgets, and insightful analytics.',
                'status': 'Live',
                'color': (1, 0.6, 0.2, 1)
            }
        ]
        
        for project in projects_data:
            project_card = MaterialCard(
                size_hint_y=None,
                height=dp(150),
                bg_color=(0.1, 0.1, 0.13, 1),
                elevation=4
            )
            
            card_layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(6))
            
            # Header with name and status
            header_layout = BoxLayout(orientation='vertical', size_hint_y=0.4, spacing=dp(4))
            
            name_label = Label(
                text=project['name'],
                font_size=dp(15),
                bold=True,
                color=(1, 1, 1, 1),
                halign='left'
            )
            name_label.bind(size=name_label.setter('text_size'))
            
            status_container = BoxLayout(orientation='horizontal', size_hint_y=0.5)
            status_card = MaterialCard(
                size_hint_x=None,
                width=dp(80),
                bg_color=(*project['color'][:3], 0.3),
                radius=15
            )
            
            status_label = Label(
                text=project['status'],
                font_size=dp(11),
                bold=True,
                color=project['color']
            )
            
            status_card.add_widget(status_label)
            status_container.add_widget(status_card)
            status_container.add_widget(Widget())  # Spacer
            
            header_layout.add_widget(name_label)
            header_layout.add_widget(status_container)
            
            # Tech stack
            tech_label = Label(
                text=project['tech'],
                font_size=dp(12),
                color=(0.7, 0.8, 1, 1),
                size_hint_y=0.2,
                halign='left'
            )
            tech_label.bind(size=tech_label.setter('text_size'))
            
            # Description
            desc_label = Label(
                text=project['desc'],
                font_size=dp(13),
                color=(0.8, 0.8, 0.8, 1),
                size_hint_y=0.4,
                halign='left',
                text_size=(None, None)
            )
            desc_label.bind(size=desc_label.setter('text_size'))
            
            card_layout.add_widget(header_layout)
            card_layout.add_widget(tech_label)
            card_layout.add_widget(desc_label)
            
            project_card.add_widget(card_layout)
            projects_layout.add_widget(project_card)
        
        scroll.add_widget(projects_layout)
        
        main_layout.add_widget(app_bar)
        main_layout.add_widget(scroll)
        
        self.add_widget(main_layout)
    
    def go_back(self):
        self.manager.transition = SlideTransition(direction='right')
        self.manager.current = 'home'

class SkillsScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = 'skills'
        
        main_layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(12))
        
        # App Bar
        app_bar = MaterialCard(
            size_hint_y=None,
            height=dp(60),
            bg_color=(0.15, 0.15, 0.2, 1),
            elevation=6
        )
        
        app_bar_layout = BoxLayout(orientation='horizontal', padding=dp(12), spacing=dp(12))
        
        back_btn = MaterialButton(
            text='← Back',
            size_hint_x=0.3,
            bg_color=(0.3, 0.3, 0.3, 1),
            size_hint_y=None,
            height=dp(36)
        )
        back_btn.bind(on_press=lambda x: self.go_back())
        
        title_label = Label(
            text='Skills & Expertise',
            font_size=dp(20),
            bold=True,
            color=(1, 1, 1, 1),
            size_hint_x=0.7,
            halign='left'
        )
        title_label.bind(size=title_label.setter('text_size'))
        
        app_bar_layout.add_widget(back_btn)
        app_bar_layout.add_widget(title_label)
        app_bar.add_widget(app_bar_layout)
        
        # Skills scroll
        scroll = ScrollView()
        skills_layout = BoxLayout(orientation='vertical', spacing=dp(12), size_hint_y=None)
        skills_layout.bind(minimum_height=skills_layout.setter('height'))
        
        skills_categories = {
            'Mobile Development': {
                'icon': '📱',
                'skills': ['Flutter', 'Dart', 'React Native', 'iOS', 'Android'],
                'color': (0.2, 0.6, 1, 1)
            },
            'Frontend & UI/UX': {
                'icon': '🎨',
                'skills': ['Figma', 'Adobe XD', 'React', 'Vue.js', 'CSS3', 'SCSS'],
                'color': (0.8, 0.4, 0.2, 1)
            },
            'Backend Development': {
                'icon': '⚙️',
                'skills': ['Node.js', 'Python', 'Firebase', 'MongoDB', 'PostgreSQL'],
                'color': (0.2, 0.8, 0.4, 1)
            },
            'Cloud & DevOps': {
                'icon': '☁️',
                'skills': ['AWS', 'Google Cloud', 'Docker', 'CI/CD', 'Git'],
                'color': (0.6, 0.2, 0.8, 1)
            },
            'Design Tools': {
                'icon': '🛠️',
                'skills': ['Photoshop', 'Illustrator', 'Sketch', 'Principle', 'After Effects'],
                'color': (1, 0.6, 0.2, 1)
            }
        }
        
        for category, data in skills_categories.items():
            category_card = MaterialCard(
                size_hint_y=None,
                height=dp(120),
                bg_color=(0.08, 0.08, 0.12, 1),
                elevation=4
            )
            
            card_layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(8))
            
            # Header
            header_layout = BoxLayout(orientation='horizontal', size_hint_y=0.35, spacing=dp(8))
            
            icon_label = Label(
                text=data['icon'],
                font_size=dp(20),
                size_hint_x=0.15
            )
            
            title_label = Label(
                text=category,
                font_size=dp(16),
                bold=True,
                color=data['color'],
                size_hint_x=0.85,
                halign='left'
            )
            title_label.bind(size=title_label.setter('text_size'))
            
            header_layout.add_widget(icon_label)
            header_layout.add_widget(title_label)
            
            # Skills chips - Wrap layout for portrait
            chips_container = BoxLayout(orientation='vertical', size_hint_y=0.65, spacing=dp(4))
            
            # Create rows of skills
            skills_per_row = 2
            for i in range(0, len(data['skills']), skills_per_row):
                row_layout = BoxLayout(orientation='horizontal', spacing=dp(6), size_hint_y=None, height=dp(30))
                
                for j in range(skills_per_row):
                    if i + j < len(data['skills']):
                        skill = data['skills'][i + j]
                        chip_card = MaterialCard(
                            size_hint_x=None,
                            width=len(skill) * dp(10) + dp(16),
                            bg_color=(*data['color'][:3], 0.2),
                            radius=15
                        )
                        
                        chip_label = Label(
                            text=skill,
                            font_size=dp(11),
                            color=data['color'],
                            bold=True
                        )
                        
                        chip_card.add_widget(chip_label)
                        row_layout.add_widget(chip_card)
                    else:
                        row_layout.add_widget(Widget())  # Empty space
                
                chips_container.add_widget(row_layout)
            
            card_layout.add_widget(header_layout)
            card_layout.add_widget(chips_container)
            
            category_card.add_widget(card_layout)
            skills_layout.add_widget(category_card)
        
        scroll.add_widget(skills_layout)
        
        main_layout.add_widget(app_bar)
        main_layout.add_widget(scroll)
        
        self.add_widget(main_layout)
    
    def go_back(self):
        self.manager.transition = SlideTransition(direction='right')
        self.manager.current = 'home'

class ContactScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.name = 'contact'
        
        main_layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(12))
        
        # App Bar
        app_bar = MaterialCard(
            size_hint_y=None,
            height=dp(60),
            bg_color=(0.15, 0.15, 0.2, 1),
            elevation=6
        )
        
        app_bar_layout = BoxLayout(orientation='horizontal', padding=dp(12), spacing=dp(12))
        
        back_btn = MaterialButton(
            text='← Back',
            size_hint_x=0.3,
            bg_color=(0.3, 0.3, 0.3, 1),
            size_hint_y=None,
            height=dp(36)
        )
        back_btn.bind(on_press=lambda x: self.go_back())
        
        title_label = Label(
            text="Let's Connect!",
            font_size=dp(20),
            bold=True,
            color=(1, 1, 1, 1),
            size_hint_x=0.7,
            halign='left'
        )
        title_label.bind(size=title_label.setter('text_size'))
        
        app_bar_layout.add_widget(back_btn)
        app_bar_layout.add_widget(title_label)
        app_bar.add_widget(app_bar_layout)
        
        # Contact content
        scroll = ScrollView()
        contact_layout = BoxLayout(orientation='vertical', spacing=dp(16), size_hint_y=None)
        contact_layout.bind(minimum_height=contact_layout.setter('height'))
        
        # Hero message
        hero_card = MaterialCard(
            size_hint_y=None,
            height=dp(100),
            bg_color=(0.1, 0.15, 0.2, 1)
        )
        
        hero_layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(6))
        
        hero_title = Label(
            text='Ready to collaborate?',
            font_size=dp(18),
            bold=True,
            color=(0.2, 0.6, 1, 1),
            size_hint_y=0.4,
            halign='center'
        )
        hero_title.bind(size=hero_title.setter('text_size'))
        
        hero_subtitle = Label(
            text="I'm always excited to work on new projects and bring creative ideas to life!",
            font_size=dp(13),
            color=(0.8, 0.8, 0.8, 1),
            size_hint_y=0.6,
            halign='center',
            text_size=(None, None)
        )
        hero_subtitle.bind(size=hero_subtitle.setter('text_size'))
        
        hero_layout.add_widget(hero_title)
        hero_layout.add_widget(hero_subtitle)
        hero_card.add_widget(hero_layout)
        
        # Contact methods
        contact_methods = [
            ('📧', 'Email', 'sarah.johnson@email.com', (0.2, 0.6, 1, 1)),
            ('📱', 'Phone', '+1 (555) 123-4567', (0.2, 0.8, 0.4, 1)),
            ('💼', 'LinkedIn', 'linkedin.com/in/sarahjohnson', (0.0, 0.5, 1, 1)),
            ('🙀', 'GitHub', 'github.com/sarahjohnson', (0.3, 0.3, 0.3, 1)),
            ('🌐', 'Website', 'www.sarahjohnson.dev', (0.8, 0.4, 0.2, 1)),
            ('📍', 'Location', 'San Francisco, CA', (0.6, 0.2, 0.8, 1))
        ]
        
        for icon, label, value, color in contact_methods:
            contact_card = MaterialCard(
                size_hint_y=None,
                height=dp(70),
                bg_color=(0.08, 0.08, 0.12, 1)
            )
            
            contact_item_layout = BoxLayout(orientation='horizontal', padding=dp(12), spacing=dp(12))
            
            # Icon circle
            icon_widget = Widget(size_hint_x=0.2)
            with icon_widget.canvas:
                Color(*color)
                icon_bg = RoundedRectangle(radius=[20] * 4, size=(dp(40), dp(40)), pos=(0, 0))
                Color(1, 1, 1, 1)
            
            def update_icon_bg(widget, bg_rect, *args):
                bg_rect.pos = (widget.x + (widget.width - dp(40))/2, 
                              widget.y + (widget.height - dp(40))/2)
            
            icon_widget.bind(pos=lambda w, *a, bg=icon_bg: update_icon_bg(w, bg, *a), 
                           size=lambda w, *a, bg=icon_bg: update_icon_bg(w, bg, *a))
            
            icon_label = Label(
                text=icon,
                font_size=dp(16),
                pos_hint={'center_x': 0.5, 'center_y': 0.5}
            )
            icon_widget.add_widget(icon_label)
            
            # Contact info
            info_layout = BoxLayout(orientation='vertical', size_hint_x=0.8)
            
            label_text = Label(
                text=label,
                font_size=dp(12),
                bold=True,
                color=color,
                size_hint_y=0.4,
                halign='left'
            )
            label_text.bind(size=label_text.setter('text_size'))
            
            value_text = Label(
                text=value,
                font_size=dp(14),
                color=(1, 1, 1, 1),
                size_hint_y=0.6,
                halign='left'
            )
            value_text.bind(size=value_text.setter('text_size'))
            
            info_layout.add_widget(label_text)
            info_layout.add_widget(value_text)
            
            contact_item_layout.add_widget(icon_widget)
            contact_item_layout.add_widget(info_layout)
            
            contact_card.add_widget(contact_item_layout)
            contact_layout.add_widget(contact_card)
        
        # CTA section
        cta_card = MaterialCard(
            size_hint_y=None,
            height=dp(90),
            bg_color=(0.05, 0.12, 0.05, 1)
        )
        
        cta_layout = BoxLayout(orientation='vertical', padding=dp(16), spacing=dp(8))
        
        cta_text = Label(
            text="Have a project in mind? Let's make it happen!",
            font_size=dp(15),
            bold=True,
            color=(0.2, 0.8, 0.4, 1),
            size_hint_y=0.6,
            halign='center'
        )
        cta_text.bind(size=cta_text.setter('text_size'))
        
        cta_subtitle = Label(
            text="Available for freelance projects and full-time opportunities",
            font_size=dp(11),
            color=(0.6, 0.8, 0.6, 1),
            size_hint_y=0.4,
            halign='center'
        )
        cta_subtitle.bind(size=cta_subtitle.setter('text_size'))
        
        cta_layout.add_widget(cta_text)
        cta_layout.add_widget(cta_subtitle)
        cta_card.add_widget(cta_layout)
        
        contact_layout.add_widget(hero_card)
        contact_layout.add_widget(cta_card)
        
        scroll.add_widget(contact_layout)
        
        main_layout.add_widget(app_bar)
        main_layout.add_widget(scroll)
        
        self.add_widget(main_layout)
    
    def go_back(self):
        self.manager.transition = SlideTransition(direction='right')
        self.manager.current = 'home'

class PortfolioApp(App):
    def build(self):
        self.title = 'Sarah Johnson - Portfolio'
        
        # Lock orientation on app start
        lock_orientation()
        
        # Create screen manager with smooth transitions
        sm = ScreenManager(transition=SlideTransition())
        
        # Add all screens
        sm.add_widget(HomeScreen())
        sm.add_widget(ProjectsScreen())
        sm.add_widget(SkillsScreen())
        sm.add_widget(ContactScreen())
        
        return sm
    
    def on_start(self):
        # Additional orientation lock when app starts
        lock_orientation()

if __name__ == '__main__':
    PortfolioApp().run()