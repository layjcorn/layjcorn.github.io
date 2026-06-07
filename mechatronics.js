document.addEventListener('DOMContentLoaded', () => {

    // --- Interactive SVG Architecture Panel Logic ---
    const archNodes = document.querySelectorAll('.arch-node:not(.logic-node)'); // Exclude flowchart nodes
    const archTitle = document.getElementById('arch-title');
    const archDesc = document.getElementById('arch-desc');

    if (archNodes.length > 0) {
        archNodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                archTitle.textContent = node.getAttribute('data-title');
                archDesc.textContent = node.getAttribute('data-desc');
                node.classList.add('active');
            });

            node.addEventListener('mouseleave', () => {
                archTitle.textContent = 'Hover over a component';
                archDesc.textContent = 'Explore the logical flow and physical integration of the control system.';
                node.classList.remove('active');
            });
        });
    }

    // --- Interactive Flowchart Code Logic ---
    const logicNodes = document.querySelectorAll('.logic-node');
    const allCodeBlocks = document.querySelectorAll('.split-code pre');
    const defaultCode = document.getElementById('code-default');
    const flowchartContainer = document.getElementById('logic-svg-container');
    const allArchLinks = document.querySelectorAll('.arch-link');

    if (logicNodes.length > 0 && allCodeBlocks.length > 0) {
        
        logicNodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                // 1. Toggle Code Blocks
                const targetId = node.getAttribute('data-target');
                const targetCode = document.getElementById(targetId);

                allCodeBlocks.forEach(block => {
                    block.classList.remove('active-code');
                    block.classList.add('hidden-code');
                });

                if (targetCode) {
                    targetCode.classList.remove('hidden-code');
                    targetCode.classList.add('active-code');
                }
                
                node.classList.add('active'); 

                // 2. Animate Corresponding Flow Lines
                const linksAttr = node.getAttribute('data-links');
                if (linksAttr) {
                    const linkIds = linksAttr.split(',');
                    linkIds.forEach(id => {
                        const link = document.getElementById(id);
                        if (link) link.classList.add('active-link');
                        link.parentNode.appendChild(link);
                    });
                }
            });
            
            node.addEventListener('mouseleave', () => {
                node.classList.remove('active');
                allArchLinks.forEach(link => link.classList.remove('active-link'));
            });
        });

        if (flowchartContainer) {
            flowchartContainer.addEventListener('mouseleave', () => {
                allCodeBlocks.forEach(block => {
                    block.classList.remove('active-code');
                    block.classList.add('hidden-code');
                });
                
                if (defaultCode) {
                    defaultCode.classList.remove('hidden-code');
                    defaultCode.classList.add('active-code');
                }
            });
        }
    }

    // --- Chart.js Initialization ---
    const ctx = document.getElementById('camChart');
    if (ctx) {
        // Updated colors to match the Mower Guard red theme
        const colorTarget = '#9ca3af'; // Gray
        const colorServo = '#111111';  // Black
        const colorStepper = '#c53f3f'; // Red Accent

        const labels = [];
        const dataTarget = [];
        const dataServo = [];
        const dataStepper = [];
        
        function calculateCamDisplacement(time) {
            let x = time % 2.0;
            if (x < 0) x += 2.0; 
            
            let y = 0;
            if (x >= 0 && x < 0.5) {
                y = 0.45 * Math.sin(Math.PI * x);
            } else if (x >= 0.5 && x < (5/6)) {
                y = 0.45 + 0.05 * (1 - Math.cos(3 * Math.PI * (x - 0.5)));
            } else if (x >= (5/6) && x < (4/3)) {
                y = 0.55 + 0.45 * (1 - Math.cos(Math.PI * (x - (5/6))));
            } else if (x >= (4/3) && x <= 2.0) {
                y = 0.5 * (1 + Math.cos( (Math.PI * (x - (4/3))) / (2/3) ));
            }
            return y * 20; 
        }

        const dt = 0.02; 
        const Kp = 4.5;  
        let currentServoPos = 0;
        let previousStepSize = 1;

        for (let t = 0; t <= 4; t += dt) {
            labels.push(t.toFixed(2));
            
            let targetY = calculateCamDisplacement(t);
            dataTarget.push(targetY);
            
            let positionError = targetY - currentServoPos;
            let servoVelocity = Kp * positionError;
            currentServoPos += servoVelocity * dt;
            dataServo.push(currentServoPos);
            
            let x = t % 2.0;
            let y = targetY / 20.0;
            let v = 0.1;
            
            if (x >= 0 && x < 0.5) {
                 v = 3.14159 * Math.sqrt(Math.max(0, 0.2025 - y*y));
            } else if (x >= 0.5 && x < (5/6)) {
                 let temp = 1.0 - ((y - 0.45) / 0.05);
                 v = 0.47124 * Math.sqrt(Math.max(0, 1.0 - temp*temp));
            } else if (x >= (5/6) && x < (4/3)) {
                 let temp = 1.0 - ((y - 0.55) / 0.45);
                 v = 1.4137 * Math.sqrt(Math.max(0, 1.0 - temp*temp));
            } else {
                 let temp = (2.0 * y) - 1.0;
                 v = 2.35619 * Math.sqrt(Math.max(0, 1.0 - temp*temp));
            }

            if (v < 0.1) v = 0.1; 

            let WaitTime = Math.floor(1500 / v);
            let StepSize = 1;
            if (WaitTime < 300) StepSize = 8;
            else if (WaitTime < 600) StepSize = 4;
            else if (WaitTime < 1200) StepSize = 2;

            let resolutionMM = StepSize * (20.0 / 3200.0);
            let stepperY = Math.round(targetY / resolutionMM) * resolutionMM;

            if (StepSize !== previousStepSize) {
                stepperY += (Math.random() > 0.5 ? 0.15 : -0.15);
            }
            previousStepSize = StepSize;
            stepperY += (Math.random() * 0.04 - 0.02);
            
            dataStepper.push(stepperY);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Target Cam Profile',
                        data: dataTarget,
                        borderColor: colorTarget,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Servo Motor (P-Control)',
                        data: dataServo,
                        borderColor: colorServo,
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Stepper Motor (Microstepping)',
                        data: dataStepper,
                        borderColor: colorStepper,
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1, 
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Time / Cycles (x)' },
                        ticks: { maxTicksLimit: 12 } 
                    },
                    y: {
                        title: { display: true, text: 'Displacement (mm)' },
                        suggestedMin: -2,
                        suggestedMax: 22
                    }
                },
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }
});