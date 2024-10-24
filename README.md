# Earn It

## Database Schema

Added by Brett 8/20/24

### Reward System

The Earn It Reward System runs in the background to track Followers and Creators and apply the specified rewards to the correct Follower. The Reward System has very specific actions it can track and apply. The mechanism for changing those actions in the database are specified below.

### mission table

This `mission` table holds the Merit Missions for each Platform. This is just the name of the mission and platform only. Right now only Instagram is supported. These are hard coded and and dependent on the Reward System to track and apply.

![mission table](/read-me/img/mission-table.png)

The Reward Actions are held in the `reward_action` table. Currently we have 6 for Instagram. Each of the `reward_action` tells the Follower how much the 'action' they perform is worth. For example see below:

![merit missions](/read-me/img/Mission.png)

Combine the `mission` Table with the `reward_action` table and we can specify how much each Mission on each Platform is worth.

The `mission_action` table has the `creator_user_id` field so that Creators can specify how much each action is worth. They cannot change the action or name of the action but they can change the value of an action for their own profile by changing the `reward_per_day` (We will be updating this field `value` for accuracy).

![reward action table](/read-me/img/reward_action-table.png)

When a Follower in Earn performs an action the Reward System will track their actions and give that Follower the specified reward. These rewards are tracked in the `reward_earned` table.

![reward earned table](/read-me/img/reward_earned-table.png)

The Reward System will apply the reward value found in `reward_action` and apply it to the proper `follower_user_id` and `creator_user_id` so that the Follower receives credit for their action.

### Put it all together

When we put all the part together this is what the database diagram looks like"

![reward system diagram](/read-me/img/reward_system_diagram.png)

# Earn It Colors

## Base color pallet:

![root color pallet](/read-me/img/root-color-pallet.png)

### Dark color pallet:

![dark color pallet](/read-me/img/dark-color-pallet.png)

Based on Sveltekit Auth
From: https://github.com/delay/sveltekit-auth

## Stripe

The stripe integration uses webhooks to finalize a subscription purchase. The webhook at /api/stripe/webhooks will be hit by stripe once the payment is confirmed on their side.

What does this mean for development?

When testing stripe localy follow the steps below to channel the Stripe webhook from Stripe back to your localhost:

- In a new terminal window run the following command
- `stripe listen --forward-to localhost:5173/api/stripe/webhooks`

* Ensure that the webhook signing secret (displayed in the terminal after running command above) matches your .env.PRIVATE_STRIPE_WEBHOOK_SECRET

That will leave the terminal and tell Stripe to send any 'test' webhooks to your local machine.
