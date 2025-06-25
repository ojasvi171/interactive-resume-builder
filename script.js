document.addEventListener('DOMContentLoaded', function() {
    //DOM Elements
    const form = document.getElementById('resume-form');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const skillInput = document.getElementById('skill-input');
    const skillTags = document.getElementById('skill-tags');
    
    //Initialize app
    init();
    
    function init() {
        //event listeners
        setupEventListeners();
        
        //skills
        setupSkills();
        
        //preview and progress
        updatePreview();
        updateProgressBar();
    }
    
    function setupEventListeners() {
        //Form inputs
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                updatePreview();
                updateProgressBar();
            });
        });
        
        //entry buttons
        document.getElementById('add-education').addEventListener('click', addEducationEntry);
        document.getElementById('add-experience').addEventListener('click', addExperienceEntry);
        document.getElementById('add-project').addEventListener('click', addProjectEntry);
        
        //Form actions
        document.getElementById('clear-form').addEventListener('click', clearForm);
        document.getElementById('download-pdf').addEventListener('click', downloadAsPdf);
        
        //Remove entry buttons
        document.querySelectorAll('.remove-entry').forEach(btn => {
            btn.addEventListener('click', function() {
                const entry = this.closest('.education-entry, .experience-entry, .project-entry');
                if (entry && document.querySelectorAll(`.${entry.className}`).length > 1) {
                    entry.remove();
                    updatePreview();
                    updateProgressBar();
                } else {
                    alert(`You need at least one ${entry.className.replace('-entry', '')} entry.`);
                }
            });
        });
    }
    
    function setupSkills() {
        //Adding skill on enter
        skillInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                e.preventDefault();
                addSkill(this.value.trim());
                this.value = '';
            }
        });
        
        //for suggested skills
        document.querySelectorAll('.suggested-tags .skill-tag').forEach(tag => {
            tag.addEventListener('click', function() {
                const skill = this.getAttribute('data-skill');
                if (!skillExists(skill)) {
                    addSkill(skill);
                }
            });
        });
    }
    
    function addSkill(skill) {
        if (skillExists(skill)) return;
        
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill;
        
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-skill';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            skillTag.remove();
            updateSkillsPreview();
            updateProgressBar();
        });
        
        skillTag.appendChild(removeBtn);
        skillTags.appendChild(skillTag);
        
        updateSkillsPreview();
        updateProgressBar();
    }
    
    function skillExists(skill) {
        const existingSkills = Array.from(document.querySelectorAll('#skill-tags .skill-tag')).map(tag => 
            tag.textContent.replace('×', '').trim()
        );
        return existingSkills.includes(skill);
    }
    
    function updateSkillsPreview() {
        const skills = Array.from(document.querySelectorAll('#skill-tags .skill-tag')).map(tag => 
            tag.textContent.replace('×', '').trim()
        );
        
        const previewSkills = document.getElementById('preview-skills');
        previewSkills.innerHTML = '';
        
        if (skills.length === 0) {
            previewSkills.textContent = 'No skills listed';
            return;
        }
        
        skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            previewSkills.appendChild(skillTag);
        });
    }
    
    function addEducationEntry() {
        const educationFields = document.getElementById('education-fields');
        const newEntry = document.createElement('div');
        newEntry.className = 'education-entry';
        newEntry.innerHTML = `
            <div class="form-grid">
                <div class="form-field">
                    <label>Degree</label>
                    <input type="text" class="education-degree" placeholder="Bachelor of Science">
                    <div class="field-focus"></div>
                </div>
                <div class="form-field">
                    <label>Institution</label>
                    <input type="text" class="education-university" placeholder="University Name">
                    <div class="field-focus"></div>
                </div>
                <div class="form-field">
                    <label>Years Attended</label>
                    <input type="text" class="education-year" placeholder="2018 - 2022">
                    <div class="field-focus"></div>
                </div>
                <div class="form-field full-width">
                    <label>Details</label>
                    <textarea class="education-details" placeholder="Relevant coursework, honors, etc."></textarea>
                    <div class="field-focus"></div>
                </div>
            </div>
            <button type="button" class="remove-entry">
                <i class="icon close"></i>
            </button>
        `;
        educationFields.appendChild(newEntry);
        
        //new inputs
        const inputs = newEntry.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updatePreview);
            input.addEventListener('input', updateProgressBar);
        });
        
        //remove functionality
        newEntry.querySelector('.remove-entry').addEventListener('click', function() {
            if (document.querySelectorAll('.education-entry').length > 1) {
                newEntry.remove();
                updatePreview();
                updateProgressBar();
            } else {
                alert('You need at least one education entry.');
            }
        });
        
        updatePreview();
        updateProgressBar();
    }
    
    function addExperienceEntry() {
        const experienceFields = document.getElementById('experience-fields');
        const newEntry = document.createElement('div');
        newEntry.className = 'experience-entry';
        newEntry.innerHTML = `
            <div class="form-grid">
                <div class="form-field">
                    <label>Job Title</label>
                    <input type="text" class="experience-title" placeholder="Software Developer">
                    <div class="field-focus"></div>
                </div>
                <div class="form-field">
                    <label>Company</label>
                    <input type="text" class="experience-company" placeholder="Tech Corp">
                    <div class="field-focus"></div>
                </div>
                <div class="form-field">
                    <label>Employment Dates</label>
                    <input type="text" class="experience-dates" placeholder="June 2020 - Present">
                    <div class="field-focus"></div>
                </div>
                <div class="form-field full-width">
                    <label>Job Description</label>
                    <textarea class="experience-description" placeholder="Your responsibilities and achievements"></textarea>
                    <div class="field-focus"></div>
                </div>
            </div>
            <button type="button" class="remove-entry">
                <i class="icon close"></i>
            </button>
        `;
        experienceFields.appendChild(newEntry);
        
        //new inputs
        const inputs = newEntry.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updatePreview);
            input.addEventListener('input', updateProgressBar);
        });
        
        //remove functionality
        newEntry.querySelector('.remove-entry').addEventListener('click', function() {
            if (document.querySelectorAll('.experience-entry').length > 1) {
                newEntry.remove();
                updatePreview();
                updateProgressBar();
            } else {
                alert('You need at least one experience entry.');
            }
        });
        
        updatePreview();
        updateProgressBar();
    }
    
    function addProjectEntry() {
        const projectFields = document.getElementById('project-fields');
        const newEntry = document.createElement('div');
        newEntry.className = 'project-entry';
        newEntry.innerHTML = `
            <div class="form-grid">
                <div class="form-field">
                    <label>Project Name</label>
                    <input type="text" class="project-name" placeholder="E-commerce Website">
                    <div class="field-focus"></div>
                </div>
                <div class="form-field">
                    <label>Technologies Used</label>
                    <input type="text" class="project-tech" placeholder="React, Node.js, MongoDB">
                    <div class="field-focus"></div>
                </div>
                <div class="form-field full-width">
                    <label>Project Description</label>
                    <textarea class="project-description" placeholder="Details about the project"></textarea>
                    <div class="field-focus"></div>
                </div>
            </div>
            <button type="button" class="remove-entry">
                <i class="icon close"></i>
            </button>
        `;
        projectFields.appendChild(newEntry);
        
        //new inputs
        const inputs = newEntry.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updatePreview);
            input.addEventListener('input', updateProgressBar);
        });
        
        //remove functionality
        newEntry.querySelector('.remove-entry').addEventListener('click', function() {
            if (document.querySelectorAll('.project-entry').length > 1) {
                newEntry.remove();
                updatePreview();
                updateProgressBar();
            } else {
                alert('You need at least one project entry.');
            }
        });
        
        updatePreview();
        updateProgressBar();
    }
    
    function updatePreview() {
        //personal info update
        document.getElementById('preview-name').textContent = 
            document.getElementById('name').value || 'Your Name';
        
        document.getElementById('preview-email').textContent = 
            document.getElementById('email').value || 'email@example.com';
        
        document.getElementById('preview-phone').textContent = 
            document.getElementById('phone').value || '';
        
        document.getElementById('preview-address').textContent = 
            document.getElementById('address').value || '';
        
        document.getElementById('preview-summary').textContent = 
            document.getElementById('summary').value || 'Professional summary goes here.';
        
        updateEducationPreview();
        updateExperiencePreview();
        updateProjectsPreview();
    }
    
    function updateEducationPreview() {
        const previewEducation = document.getElementById('preview-education');
        const entries = document.querySelectorAll('.education-entry');
        
        if (entries.length === 0) {
            previewEducation.innerHTML = '<p>No education information provided</p>';
            return;
        }
        
        let educationHTML = '';
        
        entries.forEach(entry => {
            const degree = entry.querySelector('.education-degree').value;
            const university = entry.querySelector('.education-university').value;
            const year = entry.querySelector('.education-year').value;
            const details = entry.querySelector('.education-details').value;
            
            if (degree || university || year || details) {
                educationHTML += '<div class="preview-item">';
                if (degree || university) {
                    educationHTML += `<h3>${degree || 'Degree'}${university ? `, ${university}` : ''}</h3>`;
                }
                if (year) {
                    educationHTML += `<div class="dates">${year}</div>`;
                }
                if (details) {
                    educationHTML += `<div class="description">${details}</div>`;
                }
                educationHTML += '</div>';
            }
        });
        
        previewEducation.innerHTML = educationHTML || '<p>No education information provided</p>';
    }
    
    function updateExperiencePreview() {
        const previewExperience = document.getElementById('preview-experience');
        const entries = document.querySelectorAll('.experience-entry');
        
        if (entries.length === 0) {
            previewExperience.innerHTML = '<p>No work experience provided</p>';
            return;
        }
        
        let experienceHTML = '';
        
        entries.forEach(entry => {
            const title = entry.querySelector('.experience-title').value;
            const company = entry.querySelector('.experience-company').value;
            const dates = entry.querySelector('.experience-dates').value;
            const description = entry.querySelector('.experience-description').value;
            
            if (title || company || dates || description) {
                experienceHTML += '<div class="preview-item">';
                if (title || company) {
                    experienceHTML += `<h3>${title || 'Position'}${company ? ` at ${company}` : ''}</h3>`;
                }
                if (dates) {
                    experienceHTML += `<div class="dates">${dates}</div>`;
                }
                if (description) {
                    experienceHTML += `<div class="description">${description}</div>`;
                }
                experienceHTML += '</div>';
            }
        });
        
        previewExperience.innerHTML = experienceHTML || '<p>No work experience provided</p>';
    }
    
    function updateProjectsPreview() {
        const previewProjects = document.getElementById('preview-projects');
        const entries = document.querySelectorAll('.project-entry');
        
        if (entries.length === 0) {
            previewProjects.innerHTML = '<p>No projects listed</p>';
            return;
        }
        
        let projectsHTML = '';
        
        entries.forEach(entry => {
            const name = entry.querySelector('.project-name').value;
            const tech = entry.querySelector('.project-tech').value;
            const description = entry.querySelector('.project-description').value;
            
            if (name || tech || description) {
                projectsHTML += '<div class="preview-item">';
                if (name) {
                    projectsHTML += `<h3>${name}</h3>`;
                }
                if (tech) {
                    projectsHTML += `<div class="subtitle">${tech}</div>`;
                }
                if (description) {
                    projectsHTML += `<div class="description">${description}</div>`;
                }
                projectsHTML += '</div>';
            }
        });
        
        previewProjects.innerHTML = projectsHTML || '<p>No projects listed</p>';
    }
    
    function updateProgressBar() {
        let filledFields = 0;
        const totalFields = document.querySelectorAll('input:not([type="button"]), textarea').length;
        
        //filled fields count
        document.querySelectorAll('input:not([type="button"]), textarea').forEach(field => {
            if (field.value.trim() !== '') {
                filledFields++;
            }
        });
        
        //skills count as one field
        const skillCount = document.querySelectorAll('#skill-tags .skill-tag').length;
        if (skillCount > 0) filledFields++;
        
        //progress percentage cal
        const progress = Math.min(100, Math.round((filledFields / totalFields) * 100));
        
        //progress bar and text update
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}% Complete`;
        
        //animation when progress reaches 100%
        if (progress === 100) {
            progressBar.classList.add('pulse');
        } else {
            progressBar.classList.remove('pulse');
        }
    }
    
    function clearForm() {
        if (!confirm('Are you sure you want to clear the entire form?')) return;
        
        //Reset form 
        form.reset();
        
        const educationEntries = document.querySelectorAll('.education-entry');
        const experienceEntries = document.querySelectorAll('.experience-entry');
        const projectEntries = document.querySelectorAll('.project-entry');
        
        for (let i = 1; i < educationEntries.length; i++) {
            educationEntries[i].remove();
        }
        
        for (let i = 1; i < experienceEntries.length; i++) {
            experienceEntries[i].remove();
        }
        
        for (let i = 1; i < projectEntries.length; i++) {
            projectEntries[i].remove();
        }
        
        //Clear skills
        skillTags.innerHTML = '';
        
        //Reset preview
        updatePreview();
        updateProgressBar();
    }
    
    function downloadAsPdf() {
        //Check for jsPDF
        if (window.jspdf && window.jspdf.jsPDF) {
            const { jsPDF } = window.jspdf; //jsPDF from the UMD wrapper
            const doc = new jsPDF('p', 'pt', 'a4');
            const element = document.getElementById('resume-preview');
            const options = {
                scale: 2,
                useCORS: true,
                logging: false,
                scrollY: -window.scrollY,
                windowHeight: document.documentElement.offsetHeight
            };
            html2canvas(element, options).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = doc.internal.pageSize.getWidth() - 40;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                doc.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
                doc.save('my-resume.pdf');
            }).catch(error => {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
            });
        } else {
            alert('PDF generation libraries not loaded. Please refresh the page.');
        }
    }
});
