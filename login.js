/* ========================================
   LOGIN PAGE JAVASCRIPT
======================================== */


/* ========================================
   STATIC LOGIN DETAILS
======================================== */

const STATIC_USERNAME = "Dharmendra";
const STATIC_PASSWORD = "9122656574%$#@!";


/* ========================================
   GET HTML ELEMENTS
======================================== */

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const passwordToggle =
    document.getElementById("passwordToggle");

const themeToggle =
    document.getElementById("themeToggle");

const themeToggleIcon =
    document.getElementById("themeToggleIcon");

const themeToggleText =
    document.getElementById("themeToggleText");

const themeSwitchCircle =
    document.getElementById("themeSwitchCircle");

const pageModeLabel =
    document.getElementById("pageModeLabel");

const pageModeIcon =
    document.querySelector(".page-mode-icon");

const lightVideo =
    document.getElementById("lightVideo");

const darkVideo =
    document.getElementById("darkVideo");

const forgotPassword =
    document.getElementById("forgotPassword");

const googleLogin =
    document.getElementById("googleLogin");

const signupLink =
    document.getElementById("signupLink");


/* ========================================
   THEME FUNCTIONS
======================================== */

function setLightMode() {

    document.body.classList.remove(
        "dark-mode"
    );


    if (lightVideo) {
        lightVideo.play().catch(() => {});
    }


    if (darkVideo) {
        darkVideo.pause();
    }


    if (themeToggleIcon) {
        themeToggleIcon.textContent = "☀";
    }


    if (themeToggleText) {
        themeToggleText.textContent =
            "Light Mode";
    }


    if (pageModeIcon) {
        pageModeIcon.textContent = "☀";
    }


    if (pageModeLabel) {
        const modeText =
            pageModeLabel.querySelector("strong");

        if (modeText) {
            modeText.textContent =
                "LIGHT MODE";
        }
    }


    localStorage.setItem(
        "taskPortalTheme",
        "light"
    );
}


function setDarkMode() {

    document.body.classList.add(
        "dark-mode"
    );


    if (darkVideo) {
        darkVideo.currentTime = 0;

        darkVideo.play().catch(() => {});
    }


    if (lightVideo) {
        lightVideo.pause();
    }


    if (themeToggleIcon) {
        themeToggleIcon.textContent = "☾";
    }


    if (themeToggleText) {
        themeToggleText.textContent =
            "Dark Mode";
    }


    if (pageModeIcon) {
        pageModeIcon.textContent = "☾";
    }


    if (pageModeLabel) {
        const modeText =
            pageModeLabel.querySelector("strong");

        if (modeText) {
            modeText.textContent =
                "DARK MODE";
        }
    }


    localStorage.setItem(
        "taskPortalTheme",
        "dark"
    );
}


/* ========================================
   THEME TOGGLE
======================================== */

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            if (isDark) {
                setLightMode();
            } else {
                setDarkMode();
            }

        }
    );

}


/* ========================================
   LOAD SAVED THEME
======================================== */

const savedTheme =
    localStorage.getItem(
        "taskPortalTheme"
    );


if (savedTheme === "dark") {

    setDarkMode();

} else {

    setLightMode();

}


/* ========================================
   PASSWORD SHOW / HIDE
======================================== */

if (passwordToggle) {

    passwordToggle.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                passwordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type =
                    "password";

                passwordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* ========================================
   LOGIN FORM
======================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const enteredUsername =
                usernameInput.value.trim();

            const enteredPassword =
                passwordInput.value;


            /* ------------------------------
               EMPTY USERNAME
            ------------------------------ */

            if (enteredUsername === "") {

                alert(
                    "Please enter your username."
                );

                usernameInput.focus();

                return;
            }


            /* ------------------------------
               EMPTY PASSWORD
            ------------------------------ */

            if (enteredPassword === "") {

                alert(
                    "Please enter your password."
                );

                passwordInput.focus();

                return;
            }


            /* ------------------------------
               CHECK LOGIN
            ------------------------------ */

            if (
                enteredUsername ===
                    STATIC_USERNAME &&
                enteredPassword ===
                    STATIC_PASSWORD
            ) {

                /*
                 * Login successful
                 */

                sessionStorage.setItem(
                    "taskPortalLoggedIn",
                    "true"
                );


                /*
                 * Open Task Portal
                 *
                 * index.html is in the
                 * same folder.
                 */

                window.location.href =
                    "./index.html";

            } else {

                alert(
                    "Invalid username or password."
                );


                passwordInput.focus();

            }

        }
    );

}


/* ========================================
   FORGOT PASSWORD
======================================== */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "Please contact the administrator to reset your password."
            );

        }
    );

}


/* ========================================
   GOOGLE LOGIN
======================================== */

if (googleLogin) {

    googleLogin.addEventListener(
        "click",
        function () {

            alert(
                "Google Sign-In will be available soon."
            );

        }
    );

}


/* ========================================
   SIGN UP
======================================== */

if (signupLink) {

    signupLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "New account registration will be available soon."
            );

        }
    );

}


/* ========================================
   VIDEO ERROR CHECK
======================================== */

if (lightVideo) {

    lightVideo.addEventListener(
        "error",
        function () {

            console.error(
                "Light mode video could not be loaded."
            );

        }
    );

}


if (darkVideo) {

    darkVideo.addEventListener(
        "error",
        function () {

            console.error(
                "Dark mode video could not be loaded."
            );

        }
    );

}