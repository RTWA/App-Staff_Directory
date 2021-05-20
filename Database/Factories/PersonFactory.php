<?php

namespace WebApps\Apps\StaffDirectory\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use WebApps\Apps\StaffDirectory\Models\Person;

class PersonFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Person::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'forename' => $this->faker->firstName,
            'surname' => $this->faker->lastName,
            'username' => $this->faker->userName,
            'email' => $this->faker->unique()->safeEmail,
            'title' => $this->faker->jobTitle(),
            'employee_id' => strtoupper(Str::random(5)),
            'startDate' => $this->faker->date(),
            'phone' => $this->faker->phoneNumber,
            'onLeave' => $this->faker->boolean(98),
            'isCover' => $this->faker->boolean(2),
            'isSenior' => $this->faker->boolean(3),
        ];
    }
}
