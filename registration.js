/**
 * Registration Logic
 * Handles validation and formatting for vehicle and phone numbers.
 */

const Registration = {
    /**
     * 공통 확인 모달
     * settings.html 내 #confirm-modal 을 사용해서 확인/취소를 받는다.
     * 모달이 없으면 기본 window.confirm 으로 폴백.
     */
    confirmWithModal: function (message, onConfirm) {
        const modal = document.getElementById('confirm-modal');
        const msgEl = document.getElementById('confirm-message');
        const okBtn = document.getElementById('confirm-ok');
        const cancelBtn = document.getElementById('confirm-cancel');

        // 모달 요소가 없으면 기본 confirm 사용
        if (!modal || !msgEl || !okBtn || !cancelBtn) {
            if (window.confirm(message)) {
                onConfirm && onConfirm();
            }
            return;
        }

        msgEl.textContent = message;
        modal.style.display = 'flex';
        cancelBtn.style.display = 'inline-block';
        okBtn.textContent = '확인';

        const close = () => {
            modal.style.display = 'none';
            okBtn.onclick = null;
            cancelBtn.onclick = null;
            cancelBtn.style.display = 'inline-block';
            okBtn.textContent = '확인';
        };

        cancelBtn.onclick = () => {
            close();
        };

        okBtn.onclick = () => {
            close();
            onConfirm && onConfirm();
        };
    },

    /**
     * 단순 안내용 알림 모달 (확인 버튼만)
     */
    showAlertModal: function (message) {
        const modal = document.getElementById('confirm-modal');
        const msgEl = document.getElementById('confirm-message');
        const okBtn = document.getElementById('confirm-ok');
        const cancelBtn = document.getElementById('confirm-cancel');

        if (!modal || !msgEl || !okBtn || !cancelBtn) {
            window.alert(message);
            return;
        }

        msgEl.textContent = message;
        modal.style.display = 'flex';
        cancelBtn.style.display = 'none';
        okBtn.textContent = '확인';

        const close = () => {
            modal.style.display = 'none';
            okBtn.onclick = null;
            cancelBtn.onclick = null;
            cancelBtn.style.display = 'inline-block';
            okBtn.textContent = '확인';
        };

        okBtn.onclick = () => {
            close();
        };
    },

    /**
     * 공통 확인 모달
     * settings.html 내 #confirm-modal 을 사용해서 확인/취소를 받는다.
     * 모달이 없으면 기본 window.confirm 으로 폴백.
     */
    confirmWithModal: function (message, onConfirm) {
        const modal = document.getElementById('confirm-modal');
        const msgEl = document.getElementById('confirm-message');
        const okBtn = document.getElementById('confirm-ok');
        const cancelBtn = document.getElementById('confirm-cancel');

        // 모달 요소가 없으면 기본 confirm 사용
        if (!modal || !msgEl || !okBtn || !cancelBtn) {
            if (window.confirm(message)) {
                onConfirm && onConfirm();
            }
            return;
        }

        msgEl.textContent = message;
        modal.style.display = 'flex';

        const close = () => {
            modal.style.display = 'none';
            okBtn.onclick = null;
            cancelBtn.onclick = null;
        };

        cancelBtn.onclick = () => {
            close();
        };

        okBtn.onclick = () => {
            close();
            onConfirm && onConfirm();
        };
    },

    /**
     * Regex patterns for validation
     */
    patterns: {
        // Vehicle: 2~3 digits, 1 Hangul char, 4 digits (e.g., 12가1234, 123가1234)
        vehicle: /^\d{2,3}[가-힣]\d{4}$/,

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
     * Must match: 12가1234 또는 123가1234 (no spaces allowed to be strict, or we can strip them)
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
        console.log('Registration.init() starting...');
        const user = Auth.getSession();
        if (!user) {
            console.error('Registration.init: No user session found.');
            return;
        }

        this.initVehicle(user);
        this.initPhone(user);
    },

    initVehicle: function (user) {
        const els = {
            form: document.getElementById('vehicle-form'),
            display: document.getElementById('vehicle-display'),
            value: document.getElementById('vehicle-value'),
            input: document.getElementById('vehicle-input'),
            btnRegister: document.getElementById('btn-register-vehicle'),
            btnEdit: document.getElementById('btn-edit-vehicle'),
            btnDelete: document.getElementById('btn-delete-vehicle'),
            btnCancel: document.getElementById('btn-cancel-vehicle')
        };

        if (!els.form || !els.display) {
            console.error('Registration.initVehicle: Missing critical elements');
            return;
        }

        // UI Updater
        const updateUI = (number) => {
            if (number) {
                els.form.style.display = 'none';
                els.display.style.display = 'block';
                els.value.textContent = number;
                if (els.btnCancel) els.btnCancel.style.display = 'none';
            } else {
                els.form.style.display = 'block';
                els.display.style.display = 'none';
                if (els.input) els.input.value = '';
                if (els.btnCancel) els.btnCancel.style.display = 'none';
            }
        };

        // Initial render
        updateUI(user.vehicleNumber);

        // Bind Events
        if (els.btnEdit) {
            els.btnEdit.onclick = () => { // Use onclick to ensure single binding
                els.form.style.display = 'block';
                els.display.style.display = 'none';
                if (els.input) els.input.value = user.vehicleNumber || '';
                if (els.btnCancel) els.btnCancel.style.display = 'inline-block';
            };
        }

        if (els.btnDelete) {
            els.btnDelete.onclick = () => {
                this.confirmWithModal('차량 번호를 삭제하시겠습니까?', () => {
                    Auth.updateUser({ vehicleNumber: null });
                    user.vehicleNumber = null;
                    updateUI(null);
                    alert('차량번호가 삭제되었습니다.');
                });
            };
        }

        if (els.btnCancel) {
            els.btnCancel.onclick = () => {
                updateUI(user.vehicleNumber);
            };
        }

        if (els.btnRegister) {
            els.btnRegister.onclick = () => {
                const val = els.input.value.trim().replace(/\s/g, '');
                if (!this.validateVehicle(val)) {
                    this.showAlertModal('차량번호 형식이 올바르지 않습니다. (예: 12가1234, 123가1234)');
                    return;
                }

                Auth.updateUser({ vehicleNumber: val });
                user.vehicleNumber = val;
                updateUI(val);
                alert('차량번호가 저장되었습니다.');
            };
        }
    },

    initPhone: function (user) {
        const els = {
            form: document.getElementById('phone-form'),
            display: document.getElementById('phone-display'),
            value: document.getElementById('phone-value'),
            input: document.getElementById('phone-input'),
            btnRegister: document.getElementById('btn-register-phone'),
            btnEdit: document.getElementById('btn-edit-phone'),
            btnDelete: document.getElementById('btn-delete-phone'),
            btnCancel: document.getElementById('btn-cancel-phone')
        };

        if (!els.form || !els.display) {
            console.error('Registration.initPhone: Missing critical elements');
            return;
        }

        // UI Updater
        const updateUI = (number) => {
            if (number) {
                els.form.style.display = 'none';
                els.display.style.display = 'block';
                els.value.textContent = number;
                if (els.btnCancel) els.btnCancel.style.display = 'none';
            } else {
                els.form.style.display = 'block';
                els.display.style.display = 'none';
                if (els.input) els.input.value = '';
                if (els.btnCancel) els.btnCancel.style.display = 'none';
            }
        };

        // Initial render
        updateUI(user.phoneNumber);

        // Bind Events
        if (els.btnEdit) {
            els.btnEdit.onclick = () => {
                els.form.style.display = 'block';
                els.display.style.display = 'none';
                if (els.input) els.input.value = user.phoneNumber || '';
                if (els.btnCancel) els.btnCancel.style.display = 'inline-block';
            };
        }

        if (els.btnDelete) {
            els.btnDelete.onclick = () => {
                this.confirmWithModal('휴대폰 번호를 삭제하시겠습니까?', () => {
                    Auth.updateUser({ phoneNumber: null });
                    user.phoneNumber = null;
                    updateUI(null);
                    alert('휴대폰 번호가 삭제되었습니다.');
                });
            };
        }

        if (els.btnCancel) {
            els.btnCancel.onclick = () => {
                updateUI(user.phoneNumber);
            };
        }

        if (els.btnRegister) {
            els.btnRegister.onclick = () => {
                const val = els.input.value.trim();
                // We'll trust the formatter but validate again
                if (!this.validatePhone(val)) {
                    this.showAlertModal('휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
                    return;
                }

                Auth.updateUser({ phoneNumber: val });
                user.phoneNumber = val;
                updateUI(val);
                alert('휴대폰 번호가 저장되었습니다.');
            };
        }

        // Auto-format
        if (els.input) {
            els.input.addEventListener('input', (e) => {
                e.target.value = this.formatPhoneNumber(e.target.value);
            });
        }
    }
};

// Expose
window.Registration = Registration;
