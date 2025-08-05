// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('theme-switch');
    const glassCard = document.querySelector('.glass-card');
    
    // Check for saved theme preference or respect device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme)) {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }
    
    // Add animation classes after a short delay for entrance effects
    setTimeout(() => {
        document.querySelectorAll('.feature-item').forEach(item => {
            item.style.animationPlayState = 'running';
        });
    }, 100);
    
    // Theme switch event listener
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
        
        // Add a subtle animation to the card when theme changes
        glassCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            glassCard.style.transform = 'scale(1)';
        }, 300);
    });
    
    // Add mouse move effect for parallax
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        glassCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    // Reset transform when mouse leaves
    document.addEventListener('mouseleave', () => {
        glassCard.style.transform = 'rotate(0deg) rotate(0deg) translateZ(0px)';
    });
    
    // Add click effect to the card
    glassCard.addEventListener('click', function() {
        this.style.transform = 'scale(0.98) rotateY(0deg) rotateX(0deg)';
        setTimeout(() => {
            this.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg)';
        }, 300);
    });
    
    // Button click functionality
    const clickBtn = document.getElementById('clickBtn');
    const message = document.getElementById('message');
    
    clickBtn.addEventListener('click', function() {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Show message
        message.textContent = "🎉 Day 1 Project Setup Complete! 🎉";
        message.style.opacity = '0';
        message.style.transform = 'translateY(20px)';
        
        // Animate message in
        setTimeout(() => {
            message.style.transition = 'all 0.5s ease';
            message.style.opacity = '1';
            message.style.transform = 'translateY(0)';
        }, 10);
        
        // Change button text temporarily
        const originalText = this.textContent;
        this.textContent = "Clicked!";
        
        // Reset button text after delay
        setTimeout(() => {
            this.textContent = originalText;
        }, 1000);
    });
});
