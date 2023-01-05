import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import db from "../models/index";

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
            session: false,
        },
        async function (username, password, done) {
            try {
                const user = await db.models.User.findOne({
                    where: {
                        username: username,
                    },
                });
                if (!user) {
                    return done(null, false);
                }
                const result = await bcrypt.compare(
                    password,
                    typeof user.password === "string" ? user.password : ""
                );
                if (result) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID:
                typeof process.env.GOOGLE_CLIENT_ID === "string"
                    ? process.env.GOOGLE_CLIENT_ID
                    : "",
            clientSecret:
                typeof process.env.GOOGLE_CLIENT_SECRET === "string"
                    ? process.env.GOOGLE_CLIENT_SECRET
                    : "",
            callbackURL:
                typeof process.env.GOOGLE_CALLBACK_URL === "string"
                    ? process.env.GOOGLE_CALLBACK_URL
                    : "",
        },

        async function (
            accessToken: string,
            refreshToken: string,
            profile,
            done
        ) {
            try {
                // getting the use profile picture because i wanted to store it in my database not in google's
                const res = await fetch(profile.picture, {
                    method: "GET",
                });
                const picture = await res.blob();

                const [user, created] = await db.models.User.findOrCreate({
                    where: {
                        googleid: profile.id,
                    },
                    defaults: {
                        email: profile.email,
                        username: profile.displayName,
                        googleid: profile.id,
                        picture: picture,
                    },
                });
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(
    "jwt",
    new JWTStrategy(
        {
            // jwtFromRequest: (req) => {
            //     let jwt = null;
            //     if (req && req.cookies) {
            //         jwt = req.cookies["jwt"];
            //     }
            //     return jwt;
            // },
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async function (payload, done) {
            try {
                const user = await db.models.User.findByPk(payload.id);
                if (!user) {
                    return done(null, false);
                }
                return done(null, payload);
            } catch (err) {
                done(err);
            }
        }
    )
);
