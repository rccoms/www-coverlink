/**
 * Registration Logic
 * Handles validation and formatting for vehicle and phone numbers.
 */

const Registration = {
    /**
     * Regex patterns for validation
     */
    patterns: {
        // Vehicle: 3 digits, 1 Hangul char, 4 digits (e.g., 123가1234)
        vehicle: /^\d{3}[가-힣]\d{4}$/,

        // Phone: 010-XXXX-XXXX (3-4-4 digits)
        phone: /^010-\d{3,4}-\d{4}$/
    },

    /**
     * Format phone number input as user types
     * Allowed format: 010-XXXX-XXXX
     */
    formatPhoneNumber: function (input) {
        let value = input.replace(/[^0-9]/g, ''); // Remove non-digits

        if (value.length > 3 && value.length <= 7) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 7) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }

        return value;
    },

    /**
     * Validate vehicle number
     * Must match: 123가1234 (no spaces allowed to be strict, or we can strip them)
     */
    validateVehicle: function (input) {
        // Remove spaces for validation if desired, but user asked for strict format.
        // Let's assume input might have spaces, so we strip them for check.
        const cleanInput = input.replace(/\s/g, '');
        return this.patterns.vehicle.test(cleanInput);
    },

    /**
     * Validate phone number
     */
    validatePhone: function (input) {
        return this.patterns.phone.test(input);
    },

    /**
     * Init registration forms
     */
    init: function () {
        const user = Auth.getSession();
        if (!user) return;

        // Vehicle Registration
        const vehicleForm = document.getElementById('vehicle-form');
        const vehicleInput = document.getElementById('vehicle-input');
        const vehicleDisplay = document.getElementById('vehicle-display');
        const vehicleValue = document.getElementById('vehicle-value');

        if (user.vehicleNumber) {
            vehicleForm.style.display = 'none';
            vehicleDisplay.style.display = 'block';
            vehicleValue.textContent = user.vehicleNumber;
        } else {
            vehicleForm.style.display = 'block';
            vehicleDisplay.style.display = 'none';
        }

        // Phone Registration
        const phoneForm = document.getElementById('phone-form');
        const phoneInput = document.getElementById('phone-input');
        const phoneDisplay = document.getElementById('phone-display');
        const phoneValue = document.getElementById('phone-value');

        if (user.phoneNumber) {
            phoneForm.style.display = 'none';
            phoneDisplay.style.display = 'block';
            phoneValue.textContent = user.phoneNumber;
        } else {
            phoneForm.style.display = 'block';
            phoneDisplay.style.display = 'none';
        }

        // Event Listeners

        // Phone Auto-format
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = this.formatPhoneNumber(e.target.value);
            });
        }

        // Submit Handlers
        if (vehicleForm) {
            document.getElementById('btn-register-vehicle').addEventListener('click', () => {
                const val = vehicleInput.value.trim().replace(/\s/g, '');
                if (!this.validateVehicle(val)) {
                    alert('차량번호 형식이 올바르지 않습니다. (예: 123가1234)');
                    return;
                }

                Auth.updateUser({ vehicleNumber: val });
                alert('차량번호가 등록되었습니다.');
                location.reload();
            });
        }

        if (phoneForm) {
            document.getElementById('btn-register-phone').addEventListener('click', () => {
                const val = phoneInput.value.trim();
                if (!this.validatePhone(val)) {
                    alert('휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
                    return;
                }

                Auth.updateUser({ phoneNumber: val });
                alert('휴대폰 번호가 등록되었습니다.');
                location.reload();
            });
        }
    }
};

// Expose
window.Registration = Registration;
