document.addEventListener('DOMContentLoaded', () => {

    // --- Interactive SVG Tooltips ---
    const tooltip = document.getElementById('tooltip');
    const nodes = document.querySelectorAll('.interactive-node');
    const svgContainer = document.querySelector('.architecture-diagram');

    nodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            const specData = node.getAttribute('data-spec');
            if (specData) {
                // Replace ' | ' with actual line breaks for the tooltip display
                tooltip.textContent = specData.replace(' | ', '\n');
                tooltip.style.opacity = '1';
            }
        });

        node.addEventListener('mousemove', (e) => {
            // Get coordinates relative to the container
            const rect = svgContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            tooltip.style.left = `${x + 15}px`;
            tooltip.style.top = `${y + 15}px`;
        });

        node.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // --- Chart.js Initialization ---
    const ctx = document.getElementById('camChart');
    if (ctx) {
        // Read CSS variables for colors
        const style = getComputedStyle(document.body);
        const colorTarget = style.getPropertyValue('--chart-target').trim() || '#9ca3af';
        const colorServo = style.getPropertyValue('--chart-servo').trim() || '#ef4444';
        const colorStepper = style.getPropertyValue('--chart-stepper').trim() || '#3b82f6';

        const labels = [];
        const dataTarget = [];
        const dataServo = [];
        const dataStepper = [];
        
        // Helper function translating the piecewise math from Desmos into JS
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
            return y * 20; // 20mm physical stroke
        }

        const dt = 0.02; 
        const Kp = 4.5;  
        let currentServoPos = 0;
        let previousStepSize = 1;

        // Generate 3 full cycles (0 to 6)
        for (let t = 0; t <= 6; t += dt) {
            labels.push(t.toFixed(2));
            
            // 1. True Mathematical Target
            let targetY = calculateCamDisplacement(t);
            dataTarget.push(targetY);
            
            // 2. Servo Simulation
            let positionError = targetY - currentServoPos;
            let servoVelocity = Kp * positionError;
            currentServoPos += servoVelocity * dt;
            dataServo.push(currentServoPos);
            
            // 3. True Stepper Simulation (Ported from FinalProjectCode1.spin2)
            let x = t % 2.0;
            let y = targetY / 20.0;
            let v = 0.1;
            
            // Calculate theoretical velocity profile
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

            // Zero-velocity hiccup logic
            if (v < 0.1) {
                v = 0.1; 
            }

            // Determine dynamic StepSize based on WaitTime
            let WaitTime = Math.floor(1500 / v);
            let StepSize = 1;
            if (WaitTime < 300) StepSize = 8;
            else if (WaitTime < 600) StepSize = 4;
            else if (WaitTime < 1200) StepSize = 2;

            // Physical resolution conversion (20mm stroke / 3200 steps)
            let resolutionMM = StepSize * (20.0 / 3200.0);
            
            // Quantize to the nearest hardware step
            let stepperY = Math.round(targetY / resolutionMM) * resolutionMM;

            // Introduce mechanical "jolt" when microstepping modes change
            if (StepSize !== previousStepSize) {
                stepperY += (Math.random() > 0.5 ? 0.15 : -0.15);
            }
            previousStepSize = StepSize;

            // Add inherent base mechanical vibration
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
                        label: 'Stepper Motor (Dynamic Microstepping)',
                        data: dataStepper,
                        borderColor: colorStepper,
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1, // Stiff tension to show jagged microstepping
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
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' mm';
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Interactive Flowchart Code Logic ---
    const logicNodes = document.querySelectorAll('.logic-node');
    const allCodeBlocks = document.querySelectorAll('.split-code pre');
    const defaultCode = document.getElementById('code-default');
    
    // FIXED: Renamed this variable to avoid colliding with the first svgContainer
    const flowchartContainer = document.getElementById('logic-svg-container');

    if (logicNodes.length > 0 && allCodeBlocks.length > 0) {
        
        logicNodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                // Get the target ID from the hovered node
                const targetId = node.getAttribute('data-target');
                const targetCode = document.getElementById(targetId);

                // Hide all code blocks
                allCodeBlocks.forEach(block => {
                    block.classList.remove('active-code');
                    block.classList.add('hidden-code');
                });

                // Show target code block
                if (targetCode) {
                    targetCode.classList.remove('hidden-code');
                    targetCode.classList.add('active-code');
                }
            });
        });

        // FIXED: Updated the listener to use the new variable name
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
});